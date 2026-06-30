const requests = new Map();

function rateLimiter(maxRequests = 100, windowMs = 60000){
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip);

    // Filter only requests within window
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retry_after_seconds: Math.ceil(windowMs / 1000)
      });
    }

    // Record this request
    recent.push(now);
    requests.set(ip, recent);

    next();
  };
}

module.exports = rateLimiter;