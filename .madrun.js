import {
    run,
    cutEnv,
} from 'madrun';
import {SKIPED} from 'supertape/exit-codes';

const env = {
    ESCOVER_SUCCESS_EXIT_CODE: SKIPED,
    SUPERTAPE_CHECK_SKIPED: 1,
};

export default {
    'test': () => [env, `escover tape 'test/**/*.js' 'lib/**/*.spec.js'`],
    'coverage': async () => [env, await cutEnv('test')],
    'inspect': async () => [env, `node-inspect lib/changelog.spec.js`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'watcher': () => 'nodemon -w test -w lib --exec',
    
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
};
