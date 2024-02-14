import tryCatch from 'try-catch';
import {
    test,
    stub,
} from 'supertape';
import montag from 'montag';
import changelog from './changelog.js';

test('changelog: v', (t) => {
    const execSync = stub().returns('- putout: add new rule');
    const shortdate = stub().returns('2021.08.25');
    
    const version = 'v1.0.0';
    const result = changelog(version, {
        execSync,
        shortdate,
    });
    
    const expected = montag`
        2021.08.25, v1.0.0
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n');
    
    t.equal(result, expected);
    t.end();
});

test('changelog: no version', (t) => {
    const execSync = stub().returns('- putout: add new rule');
    const shortdate = stub().returns('2021.08.25');
    
    const result = changelog('', {
        shortdate,
        execSync,
    });
    
    const expected = montag`
        2021.08.25
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n');
    
    t.equal(result, expected);
    t.end();
});

test('changelog: date', (t) => {
    const execSync = stub().returns('- putout: add new rule');
    const shortdate = stub().returns('2021.08.25');
    
    const version = '1.0.0';
    const result = changelog(version, {
        execSync,
        shortdate,
    });
    
    const expected = montag`
        2021.08.25, v1.0.0
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n');
    
    t.equal(result, expected);
    t.end();
});

test('changelog: only feature', (t) => {
    const execSync = (cmd) => {
        if (cmd.includes('fix'))
            return '';
        
        return '- putout: add new rule\n';
    };
    
    const shortdate = stub().returns('2021.08.25');
    
    const version = '1.0.0';
    const result = changelog(version, {
        execSync,
        shortdate,
    });
    
    const expected = montag`
        2021.08.25, v1.0.0
        
        feature:
        - putout: add new rule
    `.concat('\n\n');
    
    t.equal(result, expected);
    t.end();
});

test('changelog: error', (t) => {
    const execSync = stub().throws(Error('error!'));
    const shortdate = stub().returns('2021.08.25');
    
    const version = '1.0.0';
    const [error] = tryCatch(changelog, version, {
        execSync,
        shortdate,
    });
    
    t.equal(error.message, 'error!');
    t.end();
});

test('changelog: read package: error', (t) => {
    const readPackageUpSync = stub().throws(Error('error!'));
    
    const version = '1.0.0';
    const [error] = tryCatch(changelog, version, {
        readPackageUpSync,
    });
    
    t.equal(error, 'error reading package.json: error!');
    t.end();
});

test('changelog: no fix, no feature', (t) => {
    const execSync = stub().returns('');
    const shortdate = stub().returns('2021.08.25');
    const version = '1.0.0';
    
    const [error] = tryCatch(changelog, version, {
        execSync,
        shortdate,
    });
    
    t.match(error.message, `No new 'feature' and 'fix' commits from v`);
    t.end();
});

test('changelog: no fix, no feature: no overrides', (t) => {
    const [error] = tryCatch(changelog);
    
    t.match(error.message, `No new 'feature' and 'fix' commits from v`);
    t.end();
});
