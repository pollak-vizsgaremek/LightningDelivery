import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(401).send("Jelentkezz be!");
  }

  try {
    const token = accessToken.split(" ")[1];
    const tokenData = jwt.verify(token, "secret");
    req.user = tokenData;

    return next();
  } catch (error) {
    return res.status(403).json(error);
  }
};

export default authMiddleware;
