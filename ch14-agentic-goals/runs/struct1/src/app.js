import { randomUUID } from 'node:crypto';
import express from 'express';

const MAX_LEN = 200;

function cleanString(value, field) {
  if (typeof value !== 'string') {
    return { error: `${field} is required and must be a string` };
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return { error: `${field} must not be blank` };
  }
  if (trimmed.length > MAX_LEN) {
    return { error: `${field} must be at most ${MAX_LEN} characters` };
  }
  return { value: trimmed };
}

export function createApp() {
  const books = [];
  const app = express();

  app.use(express.json());

  app.post('/books', (req, res) => {
    const body = req.body;
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Request body must be a JSON object' });
    }

    const title = cleanString(body.title, 'title');
    if (title.error) return res.status(400).json({ error: title.error });
    const author = cleanString(body.author, 'author');
    if (author.error) return res.status(400).json({ error: author.error });

    const book = {
      id: randomUUID(),
      title: title.value,
      author: author.value,
      finished: false,
      createdAt: new Date().toISOString(),
      finishedAt: null,
    };
    books.push(book);
    res.status(201).location(`/books/${book.id}`).json(book);
  });

  app.get('/books', (req, res) => {
    const { finished } = req.query;
    if (finished === undefined) {
      return res.json({ books });
    }
    if (finished !== 'true' && finished !== 'false') {
      return res.status(400).json({ error: 'finished must be "true" or "false"' });
    }
    const want = finished === 'true';
    res.json({ books: books.filter((b) => b.finished === want) });
  });

  app.patch('/books/:id/finish', (req, res) => {
    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (!book.finished) {
      book.finished = true;
      book.finishedAt = new Date().toISOString();
    }
    res.json(book);
  });

  app.delete('/books/:id', (req, res) => {
    const index = books.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const [removed] = books.splice(index, 1);
    res.json(removed);
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
    if (status >= 500) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const message = err.type === 'entity.parse.failed' ? 'Malformed JSON body' : err.message;
    res.status(status).json({ error: message });
  });

  return app;
}
