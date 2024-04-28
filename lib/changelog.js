import {execSync as _execSync} from 'node:child_process';
import tryCatch from 'try-catch';
import _shortdate from 'shortdate';
import {readPackageUpSync as _readPackageUpSync} from 'read-package-up';
import buildCommand from './build-command.js';

const parseOverrides = (overrides = {}) => {
    const {
        shortdate = _shortdate,
        execSync = _execSync,
        readPackageUpSync = _readPackageUpSync,
    } = overrides;
    
    return {
        shortdate,
        execSync,
        readPackageUpSync,
    };
};

export default (versionNew, overrides) => {
    const {
        shortdate,
        execSync,
        readPackageUpSync,
    } = parseOverrides(overrides);
    
    const [error, {packageJson} = {}] = tryCatch(readPackageUpSync);
    
    if (error)
        throw `error reading package.json: ${error.message}`;
    
    const isV = versionNew?.startsWith('v');
    const version = `v${packageJson.version}`;
    
    const gitFix = buildCommand('fix', version);
    const gitFeature = buildCommand('feature', version);
    
    if (!isV && versionNew)
        versionNew = `v${versionNew}`;
    
    const fix = execSync(gitFix, {
        encoding: 'utf8',
    });
    
    const feature = execSync(gitFeature, {
        encoding: 'utf8',
    });
    
    let head = shortdate();
    let data = '';
    
    if (versionNew)
        head += `, ${versionNew}`;
    
    head += '\n\n';
    
    if (fix || feature) {
        data = head;
        
        if (fix) {
            data += 'fix:' + '\n';
            data += `${fix}\n`;
        }
        
        if (fix && feature)
            data += '\n';
        
        if (feature) {
            data += 'feature:' + '\n';
            data += `${feature}\n`;
        }
    }
    
    if (!data)
        throw Error(`No new 'feature' and 'fix' commits from ${version}`);
    
    return data;
};
