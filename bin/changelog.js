#!/usr/bin/env node

'use strict';

const changelog = require('../lib/changelog');
const argv = require('minimist')(process.argv.slice(2));

changelog(argv._[0], (error, msg) => {
    if (error)
        return console.error(error.message);
    
    console.log(msg);
});
