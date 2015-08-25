(function() {
    'use strict';
    
    var CWD         = process.cwd(),
        
        exec        = require('child_process').exec,
        execon      = require('execon'),
        rendy       = require('rendy'),
        tryRequire  = require('tryrequire'),
        
        shortdate   = require('shortdate'),
        
        gitTempl    = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }}| sed "s/\\b{{ category }}\\b//g"';
        
    module.exports = function(versionNew, callback) {
        var gitFix, gitFeature, version,
            info        = tryRequire(CWD + '/package'),
            isV         = /^v/.test(versionNew);
        
        if (!info) {
            callback(Error('error reading package.json'));
        } else {
            version     = 'v' + info.version,
            
            gitFix      = rendy(gitTempl, {
               category : 'fix' ,
               version  : version
            });
            
            gitFeature  = rendy(gitTempl, {
               category: 'feature',
               version  : version
            });
            
            if (!isV && versionNew)
                versionNew  = 'v' + versionNew;
            
            execon.parallel([
                execon.with(exec, gitFix),
                execon.with(exec, gitFeature),
                ], function(error, fixData, featureData) {
                    var fix, feature, stderr,
                        DATA        = 0,
                        STD_ERR     = 1,
                        
                        head        = shortdate(),
                        data        = '';
                    
                    stderr          = fixData[STD_ERR] || featureData[STD_ERR];
                    
                    if (versionNew)
                        head       += ', ' + versionNew;
                    
                    head            += '\n\n';
                    
                    if (!error) {
                        fix         = fixData[DATA];
                        feature     = featureData[DATA];
                    }
                    
                    if (fix || feature) {
                        data        = head;
                        
                        if (fix) {
                            data    += 'fix:'       + '\n';
                            data    += fix          + '\n\n';
                        }
                        
                        if (feature) {
                            data    += 'feature:'   + '\n';
                            data    += feature      + '\n\n';
                        }
                    }
                    
                    if (error)
                        callback(error);
                    else if (stderr)
                        callback(Error(stderr));
                    else if (!data)
                        callback(Error('No new feature and fix commits from ' + version));
                    else
                        callback(null, data);
                });
        }
    };
    
})();
