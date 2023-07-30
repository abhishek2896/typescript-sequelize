import express, { Response, NextFunction } from "express";
import { body, param, validationResult, Result } from 'express-validator';
import { UsersControllers } from "../controllers";
import { SessionsMiddlewares } from "../middlewares";
import { NewRequest } from "../types/users.types";
const UserRoutes = express.Router();

class Error {
  [key: string]: string;
}

class ReturnError {
  error!: Error[];
  message!: string;
  data: unknown;
}

UserRoutes
  .route('/create')
  .post(
    body('email') // check for email
    .exists().withMessage('Email is required')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid'),
    body('name') // check for name
    .exists().withMessage('Name is required')
    .notEmpty().withMessage('Name is required'),
    body('password') // check for password
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password is required'),
    async (req: NewRequest, res: Response, next: NextFunction) => {
      let errors: Result = validationResult(req);
      if (!errors.isEmpty()) {
        let returnData: Error[] = [];
        for (const error of errors.array()) {
            returnData.push({
                [error.path]: error.msg
            })
        }
        const returnError: ReturnError = {
          error: returnData,
          message: "The action could not be processed properly due to invalid data provided",
          data: null
        }
        res.status(422).json(returnError);
      } else {
        next()
      }
    }, UsersControllers.create);


UserRoutes
  .route('/login')
  .post(
    body('email') // check for email
    .exists().withMessage('Email is required')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email is not valid'),
    body('password') // check for password
    .exists().withMessage('Password is required')
    .notEmpty().withMessage('Password is required'),
    async (req: NewRequest, res: Response, next: NextFunction) => {
      let errors: Result = validationResult(req);
      if (!errors.isEmpty()) {
        let returnData: Error[] = [];
        for (const error of errors.array()) {
            returnData.push({
                [error.path]: error.msg
            })
        }
        const returnError: ReturnError = {
          error: returnData,
          message: "The action could not be processed properly due to invalid data provided",
          data: null
        }
        res.status(422).json(returnError);
      } else {
        next()
      }
    }, UsersControllers.login);

UserRoutes
  .route('/findAll')
  .post(
    body('limit') // check for limit
    .exists().withMessage('Limit is required')
    .notEmpty().withMessage('Limit is required'),
    body('page') // check for page
    .exists().withMessage('Page is required')
    .notEmpty().withMessage('Page is required'),
    async (req: NewRequest, res: Response, next: NextFunction) => {
      let errors: Result = validationResult(req);
      if (!errors.isEmpty()) {
        let returnData: Error[] = [];
        for (const error of errors.array()) {
            returnData.push({
                [error.path]: error.msg
            })
        }
        const returnError: ReturnError = {
          error: returnData,
          message: "The action could not be processed properly due to invalid data provided",
          data: null
        }
        res.status(422).json(returnError);
      } else {
        next()
      }
    }, SessionsMiddlewares.checkSession, UsersControllers.findAll);

UserRoutes
  .route('/findOne/:id')
  .get(
    param('id') // check for id
    .notEmpty()
    .withMessage('Id is required'),
  async (req: NewRequest, res: Response, next: NextFunction) => {
    let errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      let returnData: Error[] = [];
      for (const error of errors.array()) {
          returnData.push({
              [error.path]: error.msg
          })
      }
      const returnError: ReturnError = {
        error: returnData,
        message: "The action could not be processed properly due to invalid data provided",
        data: null
      }
      res.status(422).json(returnError);
    } else {
      next()
    }
  }, SessionsMiddlewares.checkSession, UsersControllers.findOne);

UserRoutes
  .route('/update/:id')
  .put(
    param('id') // check for id
    .notEmpty()
    .withMessage('Id is required'),
  async (req: NewRequest, res: Response, next: NextFunction) => {
    let errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      let returnData: Error[] = [];
      for (const error of errors.array()) {
          returnData.push({
              [error.path]: error.msg
          })
      }
      const returnError: ReturnError = {
        error: returnData,
        message: "The action could not be processed properly due to invalid data provided",
        data: null
      }
      res.status(422).json(returnError);
    } else {
      next()
    }
  }, SessionsMiddlewares.checkSession, UsersControllers.update);

UserRoutes
  .route('/deleteUser/:id')
  .delete(
    param('id') // check for id
    .notEmpty()
    .withMessage('Id is required'),
  async (req: NewRequest, res: Response, next: NextFunction) => {
    let errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      let returnData: Error[] = [];
      for (const error of errors.array()) {
          returnData.push({
              [error.path]: error.msg
          })
      }
      const returnError: ReturnError = {
        error: returnData,
        message: "The action could not be processed properly due to invalid data provided",
        data: null
      }
      res.status(422).json(returnError);
    } else {
      next()
    }
  }, SessionsMiddlewares.checkSession, UsersControllers.deleteUser);


export default UserRoutes;