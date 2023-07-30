import { NextFunction, Response } from "express";
import { UsersServices } from "../services";
import { ReturnManyUsers, ReturnOneUser, ReturnLoginToken, NewRequest } from "../types/users.types";
import { Users } from "../models";


export default class UsersControllers {

  // Create and Save a new User
  public static create = async (req: NewRequest, res: Response) => {
    const returnData: ReturnLoginToken = await UsersServices.create(req.body)
    return res.status(returnData.error ? 500 : 200).send(returnData);
  };

  // Login User
  public static login = async (req: NewRequest, res: Response, next: NextFunction) => {
    const returnData: ReturnLoginToken = await UsersServices.login(req.body)
    return res.status(returnData.error ? 500 : 200).send(returnData);
  };

  // Retrieve all User from the database.
  public static findAll = async (req: NewRequest, res: Response) => {
    const returnData: ReturnManyUsers = await  UsersServices.findMany(req.body, req.user as Users)
    return res.status(returnData.message === "You are not authorized to perform this task!" ? 403 : returnData.error ? 500 : 200).send(returnData);
  };

  // Find a single User with an id
  public static findOne = async (req: NewRequest, res: Response) => {
    const returnData: ReturnOneUser = await UsersServices.findOne(req.params.id, req.user as Users)
    return res.status(returnData.message === "You are not authorized to perform this task!" ? 403 : returnData.error ? 500 : 200).send(returnData);
  };

  // Update a User by the id in the request
  public static update = async (req: NewRequest, res: Response) => {
    const returnData: ReturnOneUser = await UsersServices.update(req.params.id, req.body, req.user as Users)
    return res.status(returnData.message === "You are not authorized to perform this task!" ? 403 : returnData.error ? 500 : 200).send(returnData);
  };

  // Delete a User with the specified id in the request
  public static deleteUser = async (req: NewRequest, res: Response) => {
    const returnData: ReturnOneUser = await UsersServices.delete(req.params.id, req.user as Users)
    return res.status(returnData.message === "You are not authorized to perform this task!" ? 403 : returnData.error ? 500 : 200).send(returnData);
  };
};