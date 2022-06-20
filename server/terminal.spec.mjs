import {createMockImport} from 'mock-import';

import {
    test,
    stub,
} from 'supertape';

import mockRequire from 'mock-require';

const {mockImport} = createMockImport(import.meta.url);

import terminal from './terminal.mjs';
import {createConfigManager} from './cloudcmd.mjs';
const terminalPath = './terminal';

const {stopAll} = mockRequire;

test.skip('cloudcmd: terminal: disabled', (t) => {
    const config = createConfigManager();
    config('terminal', false);
    
    const fn = terminal(config);
    
    t.notOk(fn(), 'should return noop');
    t.end();
});

test.skip('cloudcmd: terminal: disabled: listen', (t) => {
    const config = createConfigManager();
    config('terminal', false);
    
    const fn = terminal(config).listen();
    
    t.notOk(fn, 'should return noop');
    t.end();
});

test.skip('cloudcmd: terminal: enabled', async (t) => {
    const term = stub();
    const arg = 'hello';
    
    mockImport(terminalPath, term);
    
    const terminal = await import(terminalPath);
    terminal(arg);
    
    stopAll();
    
    t.calledWith(term, [arg], 'should call terminal');
    t.end();
});

test.skip('cloudcmd: terminal: enabled: no string', (t) => {
    const {log: originalLog} = console;
    const log = stub();
    
    console.log = log;
    const config = createConfigManager();
    
    config('terminal', true);
    config('terminalPath', 'hello');
    terminal(config);
    
    console.log = originalLog;
    
    const msg = `cloudcmd --terminal: Cannot find module 'hello'`;
    const [arg] = log.args[0];
    
    t.match(arg, RegExp(msg), 'should call with msg');
    t.end();
});

test.skip('cloudcmd: terminal: no arg', (t) => {
    const gritty = {};
    
    mockImport('gritty', gritty);
    const config = createConfigManager();
    
    config('terminal', true);
    config('terminalPath', 'gritty');
    
    const result = terminal(config);
    
    stopAll();
    
    t.equal(result, gritty);
    t.end();
});

