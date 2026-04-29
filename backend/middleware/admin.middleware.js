export const isAdmin = (req, res, next) => {
  const role = req.user?.role;

  if (typeof role === "string" && role.toUpperCase() === "ADMIN") {
    return next();
  }

  return res.status(403).json({ message: "Ehhez admin jogosultság kell!" });
};

export const isAdminOrCashier = (req, res, next) => {
  const role = String(req.user?.role ?? "").toUpperCase();

  if (role === "ADMIN" || role === "PENZTAROS") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Ehhez admin vagy pénztáros jogosultság kell!" });
};
