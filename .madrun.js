import {run} from 'madrun';

const env = {
    NODE_OPTIONS: '"--loader mock-import --enable-source-maps"',
};

export default {
    'test': async () => `escover ${await run('test:only')}`,
    'test:only': () => `tape 'test/**/*.js' 'lib/**/*.spec.js'`,
    'inspect': async () => [env, `node-inspect lib/changelog.spec.js`],
    'coverage': async () => [env, `c8 ${await run('test:only')}`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
};

