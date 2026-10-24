import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

let server;
let base;

beforeEach(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://localhost:${server.address().port}`;
});

afterEach(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  });
});

async function addBook(title, author = 'Someone') {
  const res = await fetch(base + '/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author }),
  });
  return res.json();
}

async function listBooks() {
  const res = await fetch(base + '/books');
  return (await res.json()).books;
}

test('deleting an existing book removes it and leaves others', async () => {
  const a = await addBook('A');
  const b = await addBook('B');
  const res = await fetch(`${base}/books/${a.id}`, { method: 'DELETE' });
  assert.equal(res.status, 204);
  const books = await listBooks();
  assert.deepEqual(books.map((x) => x.id), [b.id]);
});

test('deleting an unknown id returns 404', async () => {
  const res = await fetch(`${base}/books/nope`, { method: 'DELETE' });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Book not found' });
});

test('deleting the same book twice returns 404 the second time', async () => {
  const a = await addBook('A');
  const first = await fetch(`${base}/books/${a.id}`, { method: 'DELETE' });
  assert.equal(first.status, 204);
  const second = await fetch(`${base}/books/${a.id}`, { method: 'DELETE' });
  assert.equal(second.status, 404);
  assert.deepEqual(await second.json(), { error: 'Book not found' });
});
