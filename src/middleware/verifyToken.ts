var jwt = require("jsonwebtoken");
import tokenHelper from "../helper/token.helper";
import errorHandler from "./errorHandler";

export default function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.PRIVATE_KEY,
      tokenHelper.getAudience(),
      (err: any) => {
        if (err) {
          errorHandler(err, res)
        } else {
          next();
        }
      }
    );
  } else {
    res.sendStatus(401);
  }
}
