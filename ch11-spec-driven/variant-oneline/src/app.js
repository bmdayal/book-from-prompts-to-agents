import { randomUUID } from 'node:crypto';
import express from 'express';

const MAX_LEN = 200;
const MIN_RATING = 1;
const MAX_RATING = 5;

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
  return Number.isInteger(value) && value >= MIN_RATING && value <= MAX_RATING;
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
      min = typeof minRating === 'string' && /^\d+$/.test(minRating) ? Number(minRating) : NaN;
      if (!isValidRating(min)) {
        return res
          .status(400)
          .json({ error: `minRating must be an integer from ${MIN_RATING} to ${MAX_RATING}` });
      }
    }

    let result = books;
    if (want !== undefined) {
      result = result.filter((b) => b.finished === want);
    }
    if (min !== undefined) {
      // Unrated books (rating null) never match a minimum rating.
      result = result.filter((b) => b.rating !== null && b.rating >= min);
    }
    res.json({ books: result });
  });

  app.patch('/books/:id/finish', (req, res) => {
    const book = books.find((b) => b.id === req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // The body is optional; when present it must be a JSON object.
    const body = req.body;
    let rating;
    if (body !== undefined && body !== null) {
      if (typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Request body must be a JSON object' });
      }
      if (body.rating !== undefined) {
        if (!isValidRating(body.rating)) {
          return res
            .status(400)
            .json({ error: `rating must be an integer from ${MIN_RATING} to ${MAX_RATING}` });
        }
        rating = body.rating;
      }
    }

    if (!book.finished) {
      book.finished = true;
      book.finishedAt = new Date().toISOString();
    }
    if (rating !== undefined) {
      book.rating = rating;
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
