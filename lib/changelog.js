(function() {
    'use strict';
    
    var CWD         = process.cwd(),
        
        fs          = require('fs'),
        exec        = require('child_process').exec,
        
        Util        = require('util-io'),
        
        tryRequire  = require('tryrequire');
        
    module.exports = function(versionNew, callback) {
        var gitFix, gitFeature, version,
            info        = tryRequire(CWD + '/package'),
            isV         = /^v/.test(versionNew),
            
            name        = 'ChangeLog',
            
            gitTempl    = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }} | sed  \'s/{{ category }}//g\'';
            
        if (!info) {
            callback({
                message: 'error reading package.json'
            });
        } else {
            version     = 'v' + info.version,
            
            gitFix      = Util.render(gitTempl, {
               category : 'fix' ,
               version  : version
            });
            
            gitFeature  = Util.render(gitTempl, {
               category: 'feature',
               version  : version
            });
            
            if (!isV && versionNew)
                versionNew  = 'v' + versionNew;
            
            fs.readFile(name, 'utf8', function(error, fileData) {
                Util.exec.parallel([
                    Util.exec.with(exec, gitFix),
                    Util.exec.with(exec, gitFeature),
                    ], function(error, fixData, featureData) {
                        var fix, feature,
                            DATA        = 0,
                            STD_ERR     = 1,
                            date        = Util.getShortDate(),
                            head        = date,
                            data        = '';
                            
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
                            
                            if (fileData && versionNew)
                                data        += '\n' + fileData;
                        }
                        
                        error   =   error                       || 
                                    Error(fixData[STD_ERR])     ||
                                    Error(featureData[STD_ERR]);
                        
                        if (error)
                            callback(error);
                        else if (!data)
                            console.log('No new feature and fix commits from', version);
                        else if (!versionNew)
                            console.log(data);
                        else
                            fs.writeFile(name, data, function(error) {
                                var msg = 'changelog: done';
                                
                                callback(error, msg);
                            });
                    });
            });
        }
    };
    
})();
