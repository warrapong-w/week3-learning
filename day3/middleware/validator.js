// Validate :id parameter is a positive integer
function validateId(req, res, next){
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0){
    return res.status(400).json({
      error: 'id ต้องเป็นจำนวนเต็มบวก'
    });
  }

  req.params.id = id;
  next();
}

// Middleware factory: require body fields
function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter(f => !req.body[f]);

    if (missing.length > 0){
      return res.status(400).json({
        error: `ต้องการ fields: ${missing.join(', ')}`
      });
    }
    next();
  };
}

module.exports = { validateId, requireFields};