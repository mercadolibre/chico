var thing=true;
var stuff=false;
var f=function(){
    'use strict';

    if(thing){
        return stuff;
    }
    return thing;
};
