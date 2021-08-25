#!/usr/bin/env node

import minimist from 'minimist';
import tryToCatch from 'try-to-catch';
import changelog from '../lib/changelog.js';

const argv = minimist(process.argv.slice(2));

const [error, msg] = await tryToCatch(changelog, argv._[0]);

if (error) {
    console.error(error.message);
    process.exit();
}

process.stdout.write(msg);

