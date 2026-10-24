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

function isValidRating(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
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
      rating: null,
      createdAt: new Date().toISOString(),
      finishedAt: null,
    };
    books.push(book);
    res.status(201).location(`/books/${book.id}`).json(book);
  });

  app.get('/books', (req, res) => {
    const { finished, minRating } = req.query;

    let want;
    if (finished !== undefined) {
      if (finished !== 'true' && finished !== 'false') {
        return res.status(400).json({ error: 'finished must be "true" or "false"' });
      }
      want = finished === 'true';
    }

    let min;
    if (minRating !== undefined) {
      if (typeof minRating !== 'string' || !/^[1-5]$/.test(minRating)) {
        return res.status(400).json({ error: 'minRating must be an integer from 1 to 5' });
      }
      min = Number(minRating);
    }

    let result = books;
    if (want !== undefined) {
      result = result.filter((b) => b.finished === want);
    }
    if (min !== undefined) {
      result = result.filter((b) => b.rating !== null && b.rating >= min);
    }
    res.json({ books: result });
  });

  app.patch('/books/:id/finish', (req, res) => {
    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // The body is optional; Express 5 leaves req.body undefined when none is sent.
    const body = req.body;
    if (body !== undefined && (body === null || typeof body !== 'object' || Array.isArray(body))) {
      return res.status(400).json({ error: 'Request body must be a JSON object' });
    }
    const rating = body === undefined ? undefined : body.rating;
    if (rating !== undefined && !isValidRating(rating)) {
      return res.status(400).json({ error: 'rating must be an integer from 1 to 5' });
    }

    if (!book.finished) {
      book.finished = true;
      book.finishedAt = new Date().toISOString();
      if (rating !== undefined) {
        book.rating = rating;
      }
    }
    res.json(book);
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
