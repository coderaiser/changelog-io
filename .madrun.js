import {run} from 'madrun';

export default {
    'lint': () => 'putout .',
    'fix:lint': () => run('lint', '--fix'),
    'test': () => `tape 'test/**/*.js' 'lib/**/*.spec.js'`,
    'coverage': async () => `c8 ${await run('test')}`,
};

