import test from 'supertape';
import buildCommand from './build-command.js';

test('changelog: build-command', (t) => {
    const result = buildCommand('fix', 'v1.0.0');
    const expected = [
        'git log v1.0.0..HEAD --pretty=format:"- %h %s"',
        '--grep "^fix(" --grep "^fix: "',
        '|',
        'sed "s/fix(/(/"',
        '|',
        'sed "s/fix: //"',
    ].join(' ');
    
    t.equal(result, expected);
    t.end();
});
