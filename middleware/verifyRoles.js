// Libraries

const verifyRoles = (...allowedRoles) => {
  // Outer function allows passing in the allowed roles
  // Inner function is the middleware
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    const result = req.roles.map((role) => rolesArray.includes(role)).find((val) => val === true);

    if (!result) return res.status(401).json({ message: 'Error: You do not have permission for this operation.' });

    next();
  };
};

module.exports = verifyRoles;
