import { Prisma, PrismaClient } from "@prisma/client";
import { CredentialsDto } from "../dto/authentication/credentials.Dto";
import bcrypt from "bcrypt";
var jwt = require("jsonwebtoken");
import tokenHelper from "../helper/token.helper";

const prisma = new PrismaClient();

const authenticate = async (credentials: CredentialsDto) => {
  let { email, password } = credentials;
  try {
    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (user === null) {
      throw Error(`User ${email} doesn't exist.`);
    }

    if (user?.passwordHash === undefined || user?.passwordHash === null) {
      throw Error(`User ${email} doesn't exist.`);
    }

    let compareResult = bcrypt.compare(password, String(user?.passwordHash));

    await compareResult.then((match: Boolean) => {
      if (!match) {
        throw Error(`Old password doesn't match.`);
      }
    });

    let audiences = tokenHelper.getAudience();
    let tokenDetails = {
      email: email,
      aud: audiences,
    };

    var token = jwt.sign(tokenDetails, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    return { accessToken: token };

  } catch (error) {
    console.error(error);
    throw error
  }
};

export default { authenticate };
