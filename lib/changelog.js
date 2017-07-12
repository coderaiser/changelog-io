'use strict';

const exec = require('child_process').exec;
const execon = require('execon');
const rendy = require('rendy');
const currify = require('currify/legacy');
const tryRequire = require('tryrequire');
const shortdate = require('shortdate');
const readPackage = require('read-pkg-up');
const gitTempl = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }}| sed "s/\\b{{ category }}\\b//g"';

const onError = currify(_onError);
const changelog = currify(_changelog);
const getPkg = (data) => data.pkg;

module.exports = (versionNew, callback) => {
    readPackage()
        .then(getPkg)
        .then(changelog(versionNew, callback))
        .catch(onError(callback));
};

function _onError(callback, error) {
    callback(Error(`error reading package.json: ${error.message}`));
}

function _changelog(versionNew, callback, info) {
    const isV = /^v/.test(versionNew);
    const version = 'v' + info.version;
    
    const gitFix = rendy(gitTempl, {
       category: 'fix' ,
       version: version
    });
    
    const gitFeature = rendy(gitTempl, {
       category: 'feature',
       version: version
    });
    
    if (!isV && versionNew)
        versionNew = 'v' + versionNew;
    
    execon.parallel([
        execon.with(exec, gitFix),
        execon.with(exec, gitFeature),
        ], (error, fixData, featureData) => {
            if (error)
                return callback(error);
            
            const DATA = 0;
            const STD_ERR = 1;
            const stderr = fixData[STD_ERR] || featureData[STD_ERR];
            
            let head = shortdate();
            let data = '';
            
            if (versionNew)
                head += ', ' + versionNew;
            
            head += '\n\n';
            
            const fix = fixData[DATA];
            const feature = featureData[DATA];
            
            if (fix || feature) {
                data = head;
                
                if (fix) {
                    data += 'fix:'       + '\n';
                    data += fix          + '\n\n';
                }
                
                if (feature) {
                    data += 'feature:'   + '\n';
                    data += feature      + '\n\n';
                }
            }
            
            if (stderr)
                return callback(Error(stderr));
            
            if (!data)
                return callback(Error('No new feature and fix commits from ' + version));
            
            callback(null, data);
        });
};

