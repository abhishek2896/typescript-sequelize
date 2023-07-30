import { NextFunction, Response } from "express";
import { Users, Sessions } from "../models";
import { DateTime } from "luxon";
import { NewRequest } from "../types/users.types";

export class ReturnAuthError {
  error!: boolean;
  message!: string;
  data!: null;
}


export default class SessionsMiddlewares {

  // Check if session is valid
  public static checkSession = async (req: NewRequest, res: Response, next: NextFunction) => {
    let bearerToken: string = '';
    const bearerHeader: string | undefined = req.headers["authorization"];
    if (typeof(bearerHeader) !== 'undefined') {
      bearerToken = bearerHeader.split(" ")[1];
    }
    const token: string = bearerToken || req.body.token || req.query.token;

    const sessionData: Sessions | null = await Sessions.findOne( { where: { accessToken: token } } );
    let returnError: ReturnAuthError = {
      error: true,
      message: 'Invalid token',
      data: null
    }
    if (sessionData) {
      if (DateTime.now() > DateTime.fromJSDate(sessionData.createdAt).plus({seconds: sessionData.ttl})) {
        returnError.message = 'Token expired';
        await Sessions.destroy({ where: {id: sessionData.id} })
        return res.status(401).send(returnError);
      } else {
        const userData: Users = await Users.findOne( { attributes : ['id', 'name', 'email', 'isAdmin'], where: { id: sessionData.userId } } ) as Users;
        req.user = userData;
        next()
      }
    } else {
      return res.status(401).send(returnError);
    }
  };
};