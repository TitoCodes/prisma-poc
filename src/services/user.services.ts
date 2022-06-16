import { Prisma, PrismaClient } from "@prisma/client";
import { SignUpDto } from "../dto/user/signUp.Dto";
import bcrypt from "bcrypt";
import { UpdatePasswordDto } from "../dto/user/updatePassword.Dto";
import tokenHelper from "../helper/token.helper";

const prisma = new PrismaClient();
const saltRounds = 10;

const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return users;
};

const updatePassword = async (updatePassword: UpdatePasswordDto, req: any) => {
  const { email, oldPassword, newPassword } = updatePassword;
  await tokenHelper
    .decodeToken(req)
    .then(async (decoded:any) => {
      if (decoded.email === email) {
        const user = await prisma.user.findUnique({
          where: { email: String(email) },
        });

        if (user === null) {
          throw Error(`User ${email} doesn't exist.`);
        }

        if (user?.passwordHash === undefined || user?.passwordHash === null) {
          throw Error(`User ${email} doesn't exist.`);
        }

        let compareResult = bcrypt.compare(
          oldPassword,
          String(user?.passwordHash)
        );

        await compareResult.then((match: Boolean) => {
          if (!match) {
            throw Error(`Old password doesn't match.`);
          }
        });

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newPassword, salt);

        await prisma.user.update({
          where: { email: String(email) },
          data: {
            passwordHash: hash,
          },
        });

        return true;
      } else {
        const error = new Error();
        error.name = "UnauthorizedError";
        throw error;
      }
    })
    .catch((error) => {
      throw error;
    });
};

const getUserDrafts = async (id: number) => {
  const drafts = await prisma.user
    .findUnique({
      where: {
        id: Number(id),
      },
    })
    .posts({
      where: { published: false },
    });

  return drafts;
};

const signUp = async (signUpUser: SignUpDto) => {
  const { posts, name, email, password } = signUpUser;

  const user = await prisma.user.findUnique({
    where: { email: String(email) },
  });

  if (user !== null) {
    throw Error(`User ${email} already exist.`);
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);

  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content };
  });

  const result = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      posts: {
        create: postData,
      },
    },
  });

  return result.id;
};

export default { signUp, getUsers, updatePassword, getUserDrafts };
