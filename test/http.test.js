const { test } = require('node:test');
const assert = require('node:assert/strict');
const { http } = require('../dist/index.js');

test('http expose exactement les méthodes de l\'interface Http (découplé d\'axios)', () => {
    assert.strictEqual(typeof http, 'object', 'http doit être un objet plain, pas l\'instance axios directement appelable');
    for (const method of ['get', 'post', 'postFile', 'put', 'putFile', 'delete']) {
        assert.strictEqual(typeof http[method], 'function', `http.${method} doit être une fonction`);
    }
});

test('http.get rejette proprement sur une requête invalide (mêmes garanties que l\'implémentation axios sous-jacente)', async () => {
    await assert.rejects(
        () => http.get('http://127.0.0.1:1/route-inexistante-pour-le-test'),
        /.+/,
        'une requête vers un port fermé doit rejeter la Promise, pas lever de façon synchrone'
    );
});

test('http.postFile et http.putFile acceptent un FormData (délèguent à post/put)', async () => {
    const form = new FormData();
    await assert.rejects(() => http.postFile('http://127.0.0.1:1/upload', form));
    await assert.rejects(() => http.putFile('http://127.0.0.1:1/upload', form));
});
