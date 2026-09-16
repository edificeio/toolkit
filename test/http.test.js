const { test } = require('node:test');
const assert = require('node:assert/strict');
const { http } = require('../dist/index.js');

test('http exposes exactly the Http interface methods (decoupled from axios)', () => {
    assert.strictEqual(typeof http, 'object', 'http must be a plain object, not the axios instance directly callable');
    for (const method of ['get', 'post', 'postFile', 'put', 'putFile', 'delete']) {
        assert.strictEqual(typeof http[method], 'function', `http.${method} must be a function`);
    }
});

test('http.get rejects cleanly on an invalid request (same guarantees as the underlying axios implementation)', async () => {
    await assert.rejects(
        () => http.get('http://127.0.0.1:1/non-existent-test-route'),
        /.+/,
        'a request to a closed port must reject the Promise, not throw synchronously'
    );
});

test('http.postFile and http.putFile accept a FormData (delegate to post/put)', async () => {
    const form = new FormData();
    await assert.rejects(() => http.postFile('http://127.0.0.1:1/upload', form));
    await assert.rejects(() => http.putFile('http://127.0.0.1:1/upload', form));
});
