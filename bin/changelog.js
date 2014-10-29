#!/usr/bin/env node

(function() {
    'use strict';
    
    var DIR         = process.cwd(),
        fs          = require('fs'),
        exec        = require('child_process').exec,
        
        Util        = require('util-io'),
        
        argv        = require('minimist')(process.argv.slice(2)),
        
        tryRequire  = require('../lib/tryRequire'),
        
        Info        = tryRequire(DIR + '/package', {log: true});
        
    if (Info)
        start(argv._[0]);
            
    function start(versionNew) {
        var isV         = /^v/.test(versionNew),
            version     = 'v' + Info.version,
            name        = 'ChangeLog',
            
            gitTempl    = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }} | sed  \'s/{{ category }}//g\'',
            
            gitFix      = Util.render(gitTempl, {
               category : 'fix' ,
               version  : version
            }),
            
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
                        head        = date + ', ' + versionNew + '\n\n',
                        data        = '';
                    
                    if (!error) {
                        fix         = fixData[DATA];
                        feature     = featureData[DATA];
                    }
                    
                    if (fix || feature) {
                        data        = head;
                        
                        if (fix) {
                            data    += 'fix:'       + '\n';
                            data    += fix          + '\n';
                        }
                        
                        if (feature) {
                            data    += 'feature:'   + '\n';
                            data    += feature      + '\n';
                        }
                        
                        if (fileData)
                            data        += '\n\n' + fileData;
                    }
                    
                    error   = error || fixData[STD_ERR] || featureData[STD_ERR];
                    
                    if (error)
                        console.error(error);
                    else if (!data)
                        console.log('No new feature and fix commits from', version);
                    else if (!versionNew)
                        console.log(data);
                    else
                        fs.writeFile(name, data, function(error) {
                                var msg = 'changelog: done';
                                
                                console.log(error || msg);
                            });
                });
        });
    }
})();
