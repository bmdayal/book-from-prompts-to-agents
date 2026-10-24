// Acceptance tests written from SPEC.md BEFORE any AI saw the feature. One test per criterion.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
let server, base;
beforeEach(async () => { server = createApp().listen(0); await new Promise(r => server.once('listening', r)); base = `http://localhost:${server.address().port}`; });
afterEach(async () => { await new Promise(r => { server.close(r); server.closeAllConnections(); }); });
const post = (b) => fetch(base + '/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
const add = async (t = 'Dune') => (await post({ title: t, author: 'A' })).json();
const finish = (id, body) => fetch(`${base}/books/${id}/finish`, { method: 'PATCH', ...(body === undefined ? {} : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
const list = async (q = '') => (await fetch(`${base}/books${q}`)).json();

test('AC1 finish with a rating', async () => {
  const b = await add(); const r = await finish(b.id, { rating: 4 }); assert.equal(r.status, 200);
  const j = await r.json(); assert.equal(j.finished, true); assert.equal(j.rating, 4);
});
test('AC2 finish with no body leaves rating null', async () => {
  const b = await add(); const r = await finish(b.id); assert.equal(r.status, 200);
  const j = await r.json(); assert.equal(j.finished, true); assert.equal(j.rating, null);
});
test('AC3 bad rating is 400 and the book stays unfinished', async () => {
  for (const bad of [0, 6, 3.5, '5']) {
    const b = await add(`b${String(bad)}`); const r = await finish(b.id, { rating: bad });
    assert.equal(r.status, 400, `rating ${JSON.stringify(bad)}`); assert.equal(typeof (await r.json()).error, 'string');
    const l = (await list()).books.find(x => x.id === b.id); assert.equal(l.finished, false, `still unfinished after ${JSON.stringify(bad)}`);
  }
});
test('AC4 finishing again does not change the rating', async () => {
  const b = await add(); await finish(b.id, { rating: 4 });
  const r = await finish(b.id, { rating: 1 }); assert.equal(r.status, 200); assert.equal((await r.json()).rating, 4);
});
test('AC5 minRating filter', async () => {
  const a = await add('a'), b = await add('b'), c = await add('c'); await add('unrated');
  await finish(a.id, { rating: 5 }); await finish(b.id, { rating: 3 }); await finish(c.id, { rating: 4 });
  const got = (await list('?minRating=4')).books.map(x => x.title).sort(); assert.deepEqual(got, ['a', 'c']);
});
test('AC6 bad minRating is 400', async () => {
  for (const bad of ['0', '6', 'x', '2.5']) assert.equal((await fetch(`${base}/books?minRating=${bad}`)).status, 400, bad);
});
test('AC7 both filters together', async () => {
  const a = await add('a'), b = await add('b'); await finish(a.id, { rating: 5 }); await finish(b.id);
  assert.deepEqual((await list('?finished=true&minRating=4')).books.map(x => x.title), ['a']);
  assert.deepEqual((await list('?finished=false&minRating=1')).books, []);
});
