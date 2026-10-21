#!/usr/bin/env node
import { main } from '../lib/cli.mjs';
await main(process.argv.slice(2));
