(function() {
    'use strict';
    
    var Util = require('util-io');
    
    module.exports  = function tryRequire(name, options) {
        var module,
            o       = options || {},
            
            error   = Util.exec.try(function() {
                module = require(name);
            });
        
        if (error)
            if (o.log)
                console.error(error.message);
            else if (o.callback)
                module = exec.bind(null, error);
        
        return module;
    };
    
    function exec(error, callback) {
        callback(error);
    }
})();
