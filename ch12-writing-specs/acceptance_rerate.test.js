// Changed rule (spec v1.1): finishing again with a new valid rating UPDATES the rating.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
let server, base;
beforeEach(async () => { server = createApp().listen(0); await new Promise(r => server.once('listening', r)); base = `http://localhost:${server.address().port}`; });
afterEach(async () => { await new Promise(r => { server.close(r); server.closeAllConnections(); }); });
const H = { 'Content-Type': 'application/json' };
test('AC4 (v1.1) finishing again with a new rating updates it', async () => {
  const b = await (await fetch(base + '/books', { method: 'POST', headers: H, body: JSON.stringify({ title: 't', author: 'a' }) })).json();
  await fetch(`${base}/books/${b.id}/finish`, { method: 'PATCH', headers: H, body: JSON.stringify({ rating: 4 }) });
  const r = await fetch(`${base}/books/${b.id}/finish`, { method: 'PATCH', headers: H, body: JSON.stringify({ rating: 1 }) });
  assert.equal(r.status, 200); assert.equal((await r.json()).rating, 1);
});
