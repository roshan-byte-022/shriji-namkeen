export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Error Details]:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
