var jwt = require("jsonwebtoken");

const getAudience = () => {
  return process.env.AUDIENCE?.split(";");
};

const isEmailSameWithLogin = async (req: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, process.env.PRIVATE_KEY);
  }
};

export default { getAudience, isEmailSameWithLogin };
