#!/usr/bin/env node

'use strict';

const argv = require('minimist')(process.argv.slice(2));
const tryToCatch = require('try-to-catch');

const changelog = require('../lib/changelog');

(async () => {
    const [error, msg] = await tryToCatch(changelog, argv._[0]);
    
    if (error)
        return console.error(error.message);
    
    console.log(msg);
})();

