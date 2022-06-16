import express from "express";
import userServices from "../services/user.services";

const router = express.Router();
import { SignUpDto } from "../dto/user/signUp.Dto";
import errorHandler from "../middleware/errorHandler";
import { UpdatePasswordDto } from "../dto/user/updatePassword.Dto";
import verifyToken from "../middleware/verifyToken";

router.post(`/signup`, async (req: any, res: any) => {
  const { name, email, posts, password } = req.body;

  userServices
    .signUp(new SignUpDto(name, email, posts, password))
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.get("/user/:id/drafts", verifyToken, async (req: any, res: any) => {
  const { id } = req.params;

  userServices
    .getUserDrafts(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.get("/users", async (req, res) => {
  userServices
    .getUsers()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(`/user/update-password`, verifyToken, async (req: any, res: any) => {
  const { email, newPassword, oldPassword } = req.body;

  await userServices
    .updatePassword(new UpdatePasswordDto(email, newPassword, oldPassword),req)
    .then((isUpdated) => {
      res.json(isUpdated);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
