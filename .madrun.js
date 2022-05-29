import {run} from 'madrun';

export default {
    'test': () => `escover tape 'test/**/*.js' 'lib/**/*.spec.js'`,
    'inspect': async () => [env, `node-inspect lib/changelog.spec.js`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'watcher': () => 'nodemon -w test -w lib --exec',
    
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
};

