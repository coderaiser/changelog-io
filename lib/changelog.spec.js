import {createMockImport} from 'mock-import';
import tryToCatch from 'try-to-catch';
import {
    test,
    stub,
} from 'supertape';

import montag from 'montag';

const {
    mockImport,
    reImportDefault,
    stopAll,
} = createMockImport(import.meta.url);

test('changelog: v', async (t) => {
    const execSync = stub().returns('- putout: add new rule\n');
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const version = 'v1.0.0';
    const result = await changelog(version);
    const expected = montag`
        2021.08.25, v1.0.0
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n\n\n');
    
    stopAll();
    
    t.equal(result, expected);
    t.end();
});

test('changelog: no version', async (t) => {
    const execSync = stub().returns('- putout: add new rule\n');
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const result = await changelog();
    const expected = montag`
        2021.08.25
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n\n\n');
    
    stopAll();
    
    t.equal(result, expected);
    t.end();
});

test('changelog', async (t) => {
    const execSync = stub().returns('- putout: add new rule\n');
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const version = '1.0.0';
    const result = await changelog(version);
    const expected = montag`
        2021.08.25, v1.0.0
        
        fix:
        - putout: add new rule
        
        feature:
        - putout: add new rule
    `.concat('\n\n\n');
    
    stopAll();
    
    t.equal(result, expected);
    t.end();
});

test('changelog: only feature', async (t) => {
    const execSync = (cmd) => {
        if (cmd.includes('fix'))
            return '';
        
        return '- putout: add new rule\n';
    };
    
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const version = '1.0.0';
    const result = await changelog(version);
    const expected = montag`
        2021.08.25, v1.0.0
        
        feature:
        - putout: add new rule
    `.concat('\n\n\n');
    
    stopAll();
    
    t.equal(result, expected);
    t.end();
});

test('changelog: error', async (t) => {
    const execSync = stub().throws(Error('error!'));
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const version = '1.0.0';
    const [error] = await tryToCatch(changelog, version);
    
    stopAll();
    
    t.equal(error.message, 'error!');
    t.end();
});

test('changelog: read package: error', async (t) => {
    const readPackageUpAsync = stub().rejects(Error('error!'));
    
    mockImport('read-pkg-up', {readPackageUpAsync});
    
    const changelog = await reImportDefault('./changelog');
    const version = '1.0.0';
    const [error] = await tryToCatch(changelog, version);
    
    stopAll();
    
    t.equal(error, 'error reading package.json: error!');
    t.end();
});

test('changelog: no fix, no feature', async (t) => {
    const execSync = stub().returns('');
    const shortdate = stub().returns('2021.08.25');
    
    mockImport('child_process', {
        execSync,
    });
    
    mockImport('shortdate', shortdate);
    
    const changelog = await reImportDefault('./changelog');
    const version = '1.0.0';
    const [error] = await tryToCatch(changelog, version);
    
    stopAll();
    
    t.match(error.message, 'No new feature and fix commits from v');
    t.end();
});
