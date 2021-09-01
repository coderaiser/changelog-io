import test from 'supertape';
import buildCommand from './build-command.js';

test('changelog: build-command: fix', (t) => {
    const result = buildCommand('fix', 'v1.0.0');
    const expected = [
        'git log v1.0.0..HEAD --pretty=format:"- %s"',
        '--grep "- fix"',
        '|',
        'sed "s/fix(/(/g"',
        '|',
        'sed "s/fix: //g"',
    ].join(' ');
    
    t.equal(result, expected);
    t.end();
});

test('changelog: build-command: feature', (t) => {
    const result = buildCommand('feature', 'v1.0.0');
    const expected = [
        'git log v1.0.0..HEAD --pretty=format:"- %s"',
        '--grep "- feature"',
        '|',
        'sed "s/feature(/(/g"',
        '|',
        'sed "s/feature: //g"',
    ].join(' ');
    
    t.equal(result, expected);
    t.end();
});

