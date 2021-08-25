import {exec} from 'child_process';
import {promisify} from 'util';

import execon from 'execon';
import tryToCatch from 'try-to-catch';
import shortdate from 'shortdate';
import {readPackageUpAsync} from 'read-pkg-up';
import buildCommand from './build-command.js';

const changelog = promisify(_changelog);

export default async (versionNew) => {
    const [error, {packageJson} = {}] = await tryToCatch(readPackageUpAsync);
    
    if (error)
        throw `error reading package.json: ${error.message}`;
    
    return await changelog(versionNew, packageJson);
};

function _changelog(versionNew, packageJson, callback) {
    const isV = /^v/.test(versionNew);
    const version = `v${packageJson.version}`;
    
    const gitFix = buildCommand('fix', version);
    const gitFeature = buildCommand('feature', version);
    
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
        
        head += '\n\n';
        
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

