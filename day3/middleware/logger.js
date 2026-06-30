function logger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const originalUrl = req.originalUrl || req.url;

  console.log(`[${timestamp}] ${req.method} ${originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusIcon = 
      res.statusCode >= 500 ? '🔴' :
      res.statusCode >= 400 ? '🟡' :
      res.statusCode >= 300 ? '🔵' :
      '🟢';

    console.log(
      `${statusIcon} ${req.method} ${originalUrl} → ${res.statusCode} (${duration}ms)`
    );
  });

  next();

}

module.exports = logger;
