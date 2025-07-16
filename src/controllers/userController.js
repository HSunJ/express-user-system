import express from 'express';
import userService from '../services/userService.js'

const userController = express.Router();

userController.route("/")
  .post(async (req, res, next) => {
    // const userParams = {
    //   email: req.body.email,
    //   name: req.body.name,
    //   passwod: req.body.password,
    // }
    // const { email, name, password } = req.body;
    const user = userService.createUser(req.body);
    return res.status(200).json(user);
  })

userController.route("/login")
  .post(async (req, res, next) => {
    const userParams = {
      email: req.body.email,
      password: req.body.password,
    }
    // const { email, password } = req.body
    const user = userService.getUser(userParams);
    return res.status(200).json(user);
  })

export default userController;
