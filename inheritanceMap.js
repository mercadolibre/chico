var map = {

    "core": {
        "type": "abstract"
    },

    "cache": {
        "type": "util"
    },
    
    "keyboard": {
        "type": "util"
    },

    "positioner": {
        "type": "util"
    },
        
    "preload": {
        "type": "util"
    },
   
    "object": {
        "type": "abstract"     
    },
    "floats": {
        "type": "abstract",
        "inheritance": "object",
        "depends": ["positioner","keyboard","cache"]
    },
        "tooltip": {
            "type": "class",
            "inheritance": "floats"
        },
        "layer": {
            "type": "class",
            "inheritance": "floats"    
        },
        "modal": {
            "type": "class",
            "inheritance": "floats"
        },
            "transitions": {
                "type": "interface",
                "implements": "modal"
            },
        "zoom": {
            "type": "class",
            "inheritance": "floats",
            "depends": ["preload"]
        },
    "controllers": {
        "type": "abstract",
        "inheritance": "object"    
    },
        "viewer": {
            "type": "class",
            "inheritance": "controllers",
            "depends": ["carousel","zoom"]
        },
        "form":{
            "type": "class",
            "inheritance": "controllers"
        },
        "tabNavigator":{
            "type": "class",
            "inheritance": "controllers"
        },
        "accordion":{
            "type": "class",
            "inheritance": "controllers"
        },
            "menu":{
                "type": "interface",
                "implements": "accordion"
            },
    "watcher": {
        "type": "abstract",
        "inheritance": "object",
        "depends": ["form"]
    },
        "custom": {
            "type": "class",
            "inheritance": "watcher"
        },
        "required": {
            "type": "class",
            "inheritance": "watcher"
        },
        "string": {
            "type": "class",
            "inheritance": "watcher"
        },
            "email": {
                "type": "interface",
                "implements": "string"
            },
            "url": {
                "type": "interface",
                "implements": "string"
            },
            "maxLength": {
                "type": "interface",
                "implements": "string"
            },
            "minLength": {
                "type": "interface",
                "implements": "string"
            },
            
        "number": {
            "type": "class",
            "inheritance": "watcher"
        },
            "price": {
                "type": "interface",
                "implements": "number"
            },
            "max": {
                "type": "interface",
                "implements": "number"
            },
            "min": {
                "type": "interface",
                "implements": "number"
            },
    "navs": {
        "type": "abstract",
        "inheritance": "object"
    },
        "dropdown": {
            "type": "class",
            "inheritance": "navs",
            "depends": ["positioner", "keyboard"]
        },
        "expando": {
            "type": "class",
            "inheritance": "navs"
        },
    "sliders": {
        "type": "abstract",
        "inheritance": "object"
    },
        "carousel": {
            "type": "class",
            "inheritance": "sliders"
        }
}