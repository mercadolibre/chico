#include "node.h"
#include <string>
using namespace v8;
using namespace node;

struct ContextifyInfo;

static Handle<Value> Wrap(const Arguments& args);
static Handle<Value> Run(const Arguments& args);
static Handle<Value> GetGlobal(const Arguments& args);
static Persistent<Context> CreateContext(ContextifyInfo* info);

// Interceptor functions for global object template.
static Handle<Value> GlobalPropertyGetter(Local<String> property,
                                          const AccessorInfo &accessInfo);
static Handle<Value> GlobalPropertySetter(Local<String> property,
                                          Local<Value> value,
                                          const AccessorInfo &accessInfo);
static Handle<Integer> GlobalPropertyQuery(Local<String> property,
                                           const AccessorInfo &accessInfo);
static Handle<Boolean> GlobalPropertyDeleter(Local<String> property,
                                             const AccessorInfo &accessInfo);
static Handle<Array> GlobalPropertyEnumerator(const AccessorInfo &accessInfo);

// ContextifyInfo (and the context) will live until dispose() is called on
// the sandbox or global.
struct ContextifyInfo {
    Persistent<Context> context;
    Persistent<Object> sandbox;
    Persistent<Object> global;

    void SetContext(Persistent<Context> context) {
        this->context = context;
    }

    void SetSandbox(Local<Object> sandbox) {
        this->sandbox = Persistent<Object>::New(sandbox);
    }
    
    void SetGlobal(Local<Object> global) {
        this->global = Persistent<Object>::New(global);
    }
};

// Dispose is attached to the sandbox as 'dispose'.  It must be called to
// free the sandbox and context memory.  ContextifyInfo keeps a strong
// persistent reference to the sandbox, so if this isn't called, the sandbox
// and the context will both leak.
static Handle<Value> Dispose(const Arguments& args) {
    Local<Value> wrapped = args.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        return ThrowException(String::New("Called dispose() twice."));
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    info->sandbox->SetHiddenValue(String::New("info"), External::Wrap(NULL));
    info->global->SetHiddenValue(String::New("info"), External::Wrap(NULL));
    info->context.Dispose();
    info->context.Clear();
    info->global.Dispose();
    info->global.Clear();
    info->sandbox->Delete(String::NewSymbol("run"));
    info->sandbox->Delete(String::NewSymbol("getGlobal"));
    info->sandbox->Delete(String::NewSymbol("dispose"));
    // Note: this won't actually free the sandbox memory unless references from
    // the JavaScript side are also dropped.
    info->sandbox.Dispose();
    info->sandbox.Clear();
    delete info;
    return Undefined();
}

// We only want to create 1 Function instance for each of these in this
// context.  Was previously creating a new Function for each Contextified
// object and causing a memory leak.
Persistent<Function> runFunc;
Persistent<Function> getGlobalFunc;
Persistent<Function> disposeFunc;

// args[0] = the sandbox object
static Handle<Value> Wrap(const Arguments& args) {
    HandleScope scope;
    Local<Object> sandbox;
    if ((args.Length() > 0) && (args[0]->IsObject())) {
        sandbox = args[0]->ToObject();
    } else {
        sandbox = Object::New();
    }
    // info is cleaned up by itself when the sandbox gets GC'd.
    ContextifyInfo* info = new ContextifyInfo();
    info->SetSandbox(sandbox);
    Persistent<Context> context = CreateContext(info);
    info->SetContext(context);
    info->SetGlobal(context->Global());

    Local<Value> wrapped = External::Wrap(info);
    sandbox->SetHiddenValue(String::New("info"), wrapped);
    info->global->SetHiddenValue(String::New("info"), wrapped);

    if (runFunc.IsEmpty()) {
        Local<FunctionTemplate> runTmpl = FunctionTemplate::New(Run);
        runFunc = Persistent<Function>::New(runTmpl->GetFunction());
    }
    sandbox->Set(String::NewSymbol("run"), runFunc);

    if (getGlobalFunc.IsEmpty()) {
        Local<FunctionTemplate> getGlobalTmpl = FunctionTemplate::New(GetGlobal);
        getGlobalFunc = Persistent<Function>::New(getGlobalTmpl->GetFunction());
    }
    sandbox->Set(String::NewSymbol("getGlobal"), getGlobalFunc);

    if (disposeFunc.IsEmpty()) {
        Local<FunctionTemplate> disposeFuncTmpl = FunctionTemplate::New(Dispose);
        disposeFunc = Persistent<Function>::New(disposeFuncTmpl->GetFunction());
    }
    sandbox->Set(String::NewSymbol("dispose"), disposeFunc);

    return scope.Close(sandbox);
}

// Create a context whose global object uses the sandbox to lookup and set
// properties.
static Persistent<Context> CreateContext(ContextifyInfo* info) {
    HandleScope scope;
    // Set up the context's global object.
    Local<FunctionTemplate> ftmpl = FunctionTemplate::New();
    ftmpl->SetHiddenPrototype(true);
    ftmpl->SetClassName(info->sandbox->GetConstructorName());
    Local<ObjectTemplate> otmpl = ftmpl->InstanceTemplate();
    otmpl->SetNamedPropertyHandler(GlobalPropertyGetter,
                                   GlobalPropertySetter,
                                   GlobalPropertyQuery,
                                   GlobalPropertyDeleter,
                                   GlobalPropertyEnumerator);
    Persistent<Context> context = Context::New(NULL, otmpl);

    // Get rid of the proxy object.
    context->DetachGlobal();
    return context;
}

/*
 * args[0] = String of code
 * args[1] = filename
 */
static Handle<Value> Run(const Arguments& args) {
    HandleScope scope;
    Local<Value> wrapped = args.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        return ThrowException(String::New("Called run() after dispose()."));
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    Persistent<Context> context = info->context;
    context->Enter();
    Local<String> code = args[0]->ToString();
    TryCatch trycatch;
    Handle<Script> script;
    if (args.Length() > 1) {
        script = Script::Compile(code, args[1]->ToString());
    } else {
        script = Script::Compile(code);
    }
    if (script.IsEmpty()) {
      context->Exit();
      return trycatch.ReThrow();
    }
    Handle<Value> result = script->Run();
    context->Exit();
    if (result.IsEmpty()) {
        return trycatch.ReThrow();
    }
    return scope.Close(result);
}

static Handle<Value> GetGlobal(const Arguments& args) {
    HandleScope scope;
    Local<Value> wrapped = args.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        return ThrowException(String::New("Called getGlobal() after dispose()."));
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    return scope.Close(info->global);
}

static Handle<Value> GlobalPropertyGetter (Local<String> property,
                                           const AccessorInfo &accessInfo) {
    HandleScope scope;
    Local<Value> wrapped = accessInfo.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        return ThrowException(String::New("Called getGlobal() after dispose()."));
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    Persistent<Object> sandbox = info->sandbox;
    Local<Value> rv = sandbox->GetRealNamedProperty(property);
    if (rv.IsEmpty()) {
        rv = info->global->GetRealNamedProperty(property);
    }
    return scope.Close(rv);
}

// Global variables get set back on the sandbox object.
static Handle<Value> GlobalPropertySetter (Local<String> property,
                                           Local<Value> value,
                                           const AccessorInfo &accessInfo) {
    HandleScope scope;
    Local<Value> wrapped = accessInfo.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        return ThrowException(String::New("Tried to set a property on global after dispose()."));
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    Persistent<Object> sandbox = info->sandbox;
    bool success = sandbox->Set(property, value);
    return scope.Close(value);
}

static Handle<Integer> GlobalPropertyQuery(Local<String> property,
                                           const AccessorInfo &accessInfo) {
    HandleScope scope;
    Local<Value> wrapped = accessInfo.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        ThrowException(String::New("Called getGlobal() after dispose()."));
        return scope.Close(Handle<Integer>());
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    if (!info->sandbox->GetRealNamedProperty(property).IsEmpty() ||
        !info->global->GetRealNamedProperty(property).IsEmpty()) {
        return scope.Close(Integer::New(None));
    }
    return scope.Close(Handle<Integer>());
}

static Handle<Boolean> GlobalPropertyDeleter(Local<String> property,
                                             const AccessorInfo &accessInfo) {
    HandleScope scope;
    Local<Value> wrapped = accessInfo.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        ThrowException(String::New("Tried to delete a property on global after dispose()."));
        return False();
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    Persistent<Object> sandbox = info->sandbox;
    bool success = sandbox->Delete(property);
    if (!success) {
        Persistent<Context> context = info->context;
        success = info->global->Delete(property);
    }
    return scope.Close(Boolean::New(success));
}

static Handle<Array> GlobalPropertyEnumerator(const AccessorInfo &accessInfo) {
    HandleScope scope;
    Local<Value> wrapped = accessInfo.This()->GetHiddenValue(String::New("info"));
    void* unwrapped = External::Unwrap(wrapped);
    if (unwrapped == NULL) {
        // We can't throw an exception because we have to return an Array,
        // and ThrowException returns a value. Returning an empty Array is
        // better than segfaulting.
        return scope.Close(Array::New());
    }
    ContextifyInfo* info = static_cast<ContextifyInfo*>(unwrapped);
    Persistent<Object> sandbox = info->sandbox;
    return scope.Close(sandbox->GetPropertyNames());
}

// Export the C++ Wrap method as 'wrap' on the module.
static void Init(Handle<Object> target) {
    HandleScope scope;
    NODE_SET_METHOD(target, "wrap", Wrap);
}

extern "C" {
  static void init(Handle<Object> target) {
    Init(target);
  }
  NODE_MODULE(contextify, init);
}
