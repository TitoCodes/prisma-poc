import express from "express";
const router = express.Router();
import authenticationService from "../services/authentication.services";
import { CredentialsDto } from "../dto/authentication/credentials.Dto";
import errorHandler from "../middleware/errorHandler";

router.post(`/login`, async (req: any, res: any) => {
  const { email, password } = req.body;

  authenticationService
    .authenticate(new CredentialsDto(email, password))
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
