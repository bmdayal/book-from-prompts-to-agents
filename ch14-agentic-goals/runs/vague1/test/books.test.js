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

function post(path, body) {
  return fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function addBook(title = 'Dune', author = 'Frank Herbert') {
  const res = await post('/books', { title, author });
  assert.equal(res.status, 201);
  return res.json();
}

test('adds a book', async () => {
  const res = await post('/books', { title: '  Dune ', author: 'Frank Herbert' });
  assert.equal(res.status, 201);
  const book = await res.json();
  assert.equal(res.headers.get('location'), `/books/${book.id}`);
  assert.equal(typeof book.id, 'string');
  assert.equal(book.title, 'Dune');
  assert.equal(book.author, 'Frank Herbert');
  assert.equal(book.finished, false);
  assert.equal(book.finishedAt, null);
  assert.ok(!Number.isNaN(Date.parse(book.createdAt)));
});

test('rejects bad input when adding a book', async () => {
  const cases = [
    { author: 'Frank Herbert' },
    { title: 'Dune', author: '   ' },
    { title: 42, author: 'Frank Herbert' },
    { title: 'x'.repeat(201), author: 'Frank Herbert' },
  ];
  for (const body of cases) {
    const res = await post('/books', body);
    assert.equal(res.status, 400, JSON.stringify(body));
    const data = await res.json();
    assert.equal(typeof data.error, 'string');
  }
  const list = await (await fetch(`${base}/books`)).json();
  assert.deepEqual(list.books, []);
});

test('rejects malformed JSON with a JSON error', async () => {
  const res = await post('/books', '{"title": ');
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(typeof data.error, 'string');
});

test('lists books in insertion order', async () => {
  let res = await fetch(`${base}/books`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { books: [] });

  const a = await addBook('Dune', 'Frank Herbert');
  const b = await addBook('Emma', 'Jane Austen');

  res = await fetch(`${base}/books`);
  const data = await res.json();
  assert.deepEqual(data.books.map((x) => x.id), [a.id, b.id]);
});

test('filters the list by finished', async () => {
  const a = await addBook('Dune', 'Frank Herbert');
  await addBook('Emma', 'Jane Austen');
  await fetch(`${base}/books/${a.id}/finish`, { method: 'PATCH' });

  const done = await (await fetch(`${base}/books?finished=true`)).json();
  assert.deepEqual(done.books.map((x) => x.id), [a.id]);

  const todo = await (await fetch(`${base}/books?finished=false`)).json();
  assert.equal(todo.books.length, 1);
  assert.equal(todo.books[0].title, 'Emma');

  const bad = await fetch(`${base}/books?finished=maybe`);
  assert.equal(bad.status, 400);
});

test('marks a book finished, idempotently', async () => {
  const book = await addBook();

  const res = await fetch(`${base}/books/${book.id}/finish`, { method: 'PATCH' });
  assert.equal(res.status, 200);
  const finished = await res.json();
  assert.equal(finished.id, book.id);
  assert.equal(finished.finished, true);
  assert.ok(!Number.isNaN(Date.parse(finished.finishedAt)));

  const again = await fetch(`${base}/books/${book.id}/finish`, { method: 'PATCH' });
  assert.equal(again.status, 200);
  assert.equal((await again.json()).finishedAt, finished.finishedAt);

  const list = await (await fetch(`${base}/books`)).json();
  assert.equal(list.books[0].finished, true);
});

test('returns 404 when finishing an unknown book', async () => {
  const res = await fetch(`${base}/books/does-not-exist/finish`, { method: 'PATCH' });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Book not found' });
});

test('deletes a book', async () => {
  const a = await addBook('Dune', 'Frank Herbert');
  const b = await addBook('Emma', 'Jane Austen');

  const res = await fetch(`${base}/books/${a.id}`, { method: 'DELETE' });
  assert.equal(res.status, 204);

  const list = await (await fetch(`${base}/books`)).json();
  assert.deepEqual(list.books.map((x) => x.id), [b.id]);

  const again = await fetch(`${base}/books/${a.id}`, { method: 'DELETE' });
  assert.equal(again.status, 404);
});

test('returns 404 when deleting an unknown book', async () => {
  const res = await fetch(`${base}/books/does-not-exist`, { method: 'DELETE' });
  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), { error: 'Book not found' });
});
