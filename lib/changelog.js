'use strict';

const {exec} = require('child_process');
const {promisify} = require('util');

const execon = require('execon');
const tryToCatch = require('try-to-catch');
const rendy = require('rendy');
const shortdate = require('shortdate');
const readPackage = require('read-pkg-up');
const gitTempl = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }}\\(| sed "s/{{ category }}(/(/g"';

const changelog = promisify(_changelog);

module.exports = async (versionNew) => {
    const [error, {packageJson} = {}] = await tryToCatch(readPackage);
    
    if (error)
        throw `error reading package.json: ${error.message}`;
    
    return await changelog(versionNew, packageJson);
};

function _changelog(versionNew, packageJson, callback) {
    const isV = /^v/.test(versionNew);
    const version = `v${packageJson.version}`;
    
    const gitFix = rendy(gitTempl, {
        category: 'fix' ,
        version,
    });
    
    const gitFeature = rendy(gitTempl, {
        category: 'feature',
        version,
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
        
        if (stderr)
            return callback(Error(stderr));
        
        let head = shortdate();
        let data = '';
        
        if (versionNew)
            head += ', ' + versionNew;
        
        head += '\n';
        
        const fix = fixData[DATA];
        const feature = featureData[DATA];
        
        if (fix || feature) {
            data = head;
            
            if (fix) {
                data += 'fix:' + '\n';
                data += fix + '\n\n';
            }
            
            if (feature) {
                data += 'feature:' + '\n';
                data += feature + '\n\n';
            }
        }
        
        if (!data)
            return callback(Error('No new feature and fix commits from ' + version));
        
        callback(null, data);
    });
}

