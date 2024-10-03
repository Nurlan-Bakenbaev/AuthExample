import jwt from "jsonwebtoken";
export const idientifier = (req, res, next) => {
  let = token;
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies("Authorization");
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const userToken = Token.split(" ")[1];
    const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
    if (jwtVerified) {
      req.user = req.headers.authorization;
      next();
    } else {
      throw new Error("Error in the authorization");
    }
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
};
