export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// oxlint-disable-next-line no-unused-vars -- Express requires 4 args to detect error middleware
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid id.' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'That value is already in use.' });
  }
  res.status(status).json({ error: err.message || 'Something went wrong.' });
}
