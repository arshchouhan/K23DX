export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validation = schema.safeParse(req.body);
      
      if (!validation.success) {
        const errors = validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors
        });
      }

      req.validatedData = validation.data;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Validation error"
      });
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validation = schema.safeParse(req.query);
      
      if (!validation.success) {
        const errors = validation.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: "Query validation failed",
          errors
        });
      }

      req.validatedQuery = validation.data;
      next();
    } catch (error) {
      console.error("Query validation middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Query validation error"
      });
    }
  };
};
