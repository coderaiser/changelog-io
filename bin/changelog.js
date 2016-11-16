#!/usr/bin/env node

'use strict';

var changelog   = require('../lib/changelog'),
    argv        = require('minimist')(process.argv.slice(2));

changelog(argv._[0], function(error, msg) {
    if (error)
        console.error(error.message);
    else
        console.log(msg);
});
