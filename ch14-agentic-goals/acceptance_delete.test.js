// Written before any agent ran. Lenient on the success status: 200 or 204 both count.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
let server, base;
beforeEach(async () => { server = createApp().listen(0); await new Promise(r => server.once('listening', r)); base = `http://localhost:${server.address().port}`; });
afterEach(async () => { await new Promise(r => { server.close(r); server.closeAllConnections(); }); });
const H = { 'Content-Type': 'application/json' };
const add = async (t) => (await fetch(base + '/books', { method: 'POST', headers: H, body: JSON.stringify({ title: t, author: 'a' }) })).json();
const del = (id) => fetch(`${base}/books/${id}`, { method: 'DELETE' });
const list = async () => (await (await fetch(base + '/books')).json()).books;
test('D1 deleting an existing book succeeds and removes it', async () => {
  const a = await add('a'); const r = await del(a.id); assert.ok([200, 204].includes(r.status), `status ${r.status}`);
  assert.deepEqual((await list()).map(b => b.title), []);
});
test('D2 unknown id is 404 with an error body', async () => {
  const r = await del('nope'); assert.equal(r.status, 404); assert.equal(typeof (await r.json()).error, 'string');
});
test('D3 deleting twice gives 404 the second time', async () => {
  const a = await add('a'); await del(a.id); assert.equal((await del(a.id)).status, 404);
});
test('D4 other books are not affected', async () => {
  const a = await add('a'), b = await add('b'), c = await add('c'); await del(b.id);
  assert.deepEqual((await list()).map(x => x.title), ['a', 'c']);
});
