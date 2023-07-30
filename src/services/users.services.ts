import { Op } from "sequelize";
import Users, { UserInput } from "../models/users.models";
import { Sessions } from "../models";
import { v4 as uuidv4 } from 'uuid';
import { ReturnManyUsers, ReturnOneUser, ReturnLoginToken, SearchUserInput } from "../types/users.types";
import { AuthUtils } from "../utils";
import { SessionInput } from "../models/session.models";
import config from "../config/config";

export default class UsersServices {

  /**
   * @description create user
   * @param {userInput} userInput the data coming from create user api 
   * @returns created user and error
   */
  public static async create(userInput: UserInput): Promise<ReturnLoginToken> {
    let returnableObject: ReturnLoginToken = new ReturnLoginToken();
    try {
      const salt: string = AuthUtils.generateSalt();
      const userObj: UserInput = {
        ...userInput,
        salt,
        id: config.env === 'test' ? userInput.id : uuidv4(),
        isAdmin: config.env === 'test' ? userInput.isAdmin : false,
        password: AuthUtils.encryptPassword(userInput.password, salt)
      };
      const userData: Users = await Users.create(userObj);
      const access_token: string = AuthUtils.generateAccessToken(userData.id, userData.email, userData.name);
      const sessionObj: SessionInput = {
        id: uuidv4(),
        userId: userData.id,
        accessToken: access_token,
        ttl: config.TTL as number, // in seconds
      }
      await Sessions.create(sessionObj);
      returnableObject.data = {
        access_token: access_token
      };
      returnableObject.message = "User created successfully!";
      returnableObject.error = false;
      return returnableObject
    } catch (error: any) {
      returnableObject.message = "Some error occurred while creating user!";
      if (error?.errors && Array.isArray(error?.errors) && error?.errors[0]?.validatorKey === 'not_unique') {
        returnableObject.message = `${error.errors[0].path} cannot be duplicate!`;
      } else {
        console.error('error', error)
      }
      returnableObject.data = {
        access_token: ''
      };
      returnableObject.error = true;
      return returnableObject
    }
  }

  /**
   * @description login user
   * @param {userInput} userInput the data coming from create user api 
   * @returns created user and error
   */
  public static async login(userInput: UserInput): Promise<ReturnLoginToken> {
    let returnableObject: ReturnLoginToken = new ReturnLoginToken();
    try {
      const user: Users = await Users.findOne({ where: { email: userInput.email } }) as Users;

      if (user) {
        if (AuthUtils.authenticate(userInput.password, user.salt, user.password)) {
          // generate access token
          const access_token: string = AuthUtils.generateAccessToken(user.id, user.email, user.name);
          const sessionObj: SessionInput = {
            id: uuidv4(),
            userId: user.id,
            accessToken: access_token,
            ttl: config.TTL as number, // in seconds
          }
          await Sessions.create(sessionObj);
          returnableObject.data = {
            access_token: access_token
          };
          returnableObject.message = "User logged in successfully!";
          returnableObject.error = false;
          return returnableObject
        } else {
          returnableObject.data = {
            access_token: ''
          };
          returnableObject.message = "Invalid password!";
          returnableObject.error = true;
          return returnableObject
        }
      } else {
        returnableObject.data = {
          access_token: ''
        };
        returnableObject.message = "Invalid user email!";
        returnableObject.error = true;
        return returnableObject
      }
    } catch (error: any) {
      console.error('error', error)
      returnableObject.data = {
        access_token: ''
      };
      returnableObject.message = "Some error occurred while creating user!";
      returnableObject.error = true;
      return returnableObject
    }
  }

  /**
   * @description find one user
   * @param {userInput} userInput the data coming from find user api 
   * @param {Users} user current user
   * @returns found user and error
   */
  public static async findOne(id: string, user: Users): Promise<ReturnOneUser> {
    let returnableObject: ReturnOneUser = new ReturnOneUser();
    let userData: Users;
    try {
      if (user.isAdmin || id === 'me' || user.id === id) {
        if (id === 'me' || user.id === id) {
          userData = user;
        } else {
          userData = await Users.findOne({ attributes : ['id', 'name', 'email', 'isAdmin'], where: { id } }) as Users;
        }
        returnableObject.data = userData
        returnableObject.message = "User data!";
        returnableObject.error = false;
        return returnableObject;
      } else {
        returnableObject.data = null;
        returnableObject.message = "You are not authorized to perform this task!";
        returnableObject.error = true;
        return returnableObject
      }
    } catch (error: any) {
      // console.error('error', error)
      returnableObject.data = null;
      returnableObject.message = "Some error occurred while fetching user!";
      returnableObject.error = true;
      return returnableObject
    }
  }

  /**
   * @description find multiple user
   * @param {userInput} userInput the data coming from find many users api 
   * @param {Users} user current user
   * @returns found users and error
   */
  public static async findMany(searchUserInput: SearchUserInput, user: Users): Promise<ReturnManyUsers> {
    let returnableObject: ReturnManyUsers = new ReturnManyUsers();
    try {
      if (!user.isAdmin) {
        returnableObject.data = null;
        returnableObject.message = "You are not authorized to perform this task!";
        returnableObject.error = true;
        return returnableObject
      } else {
        const userData: Users[] = await Users.findAll({ limit: searchUserInput.limit, offset: (searchUserInput.limit * searchUserInput.page), attributes : ['id', 'name', 'email', 'isAdmin'],
          where: {
            [Op.or]: [
              {
                id: {
                  [Op.like]: `%${searchUserInput.search}%`
                }
              },
              {
                name: {
                  [Op.like]: `%${searchUserInput.search}%`
                }
              },
              {
                email: {
                  [Op.like]: `%${searchUserInput.search}%`
                }
              }
            ]
          }
        });
        returnableObject.data = userData;
        returnableObject.error = false;
        returnableObject.message = "Users data!";
        return returnableObject;
      }
    } catch (error: any) {
      // console.error('error', error)
      returnableObject.data = null;
      returnableObject.error = true;
      returnableObject.message = "Some error occurred while fetching users!";
      return returnableObject
    }
  }

  /**
   * @description update user
   * @param {string} id id of user to be updated
   * @param {userInput} userInput the data coming from update user api 
   * @param {Users} user current user
   * @returns updated user and error
   */
  public static async update(id: string, userInput: UserInput, user: Users): Promise<ReturnOneUser> {
    let returnableObject: ReturnOneUser = new ReturnOneUser();
    try {
      if (user.id !== id && !user.isAdmin) {
        returnableObject.data = null;
        returnableObject.message = "You are not authorized to perform this task!";
        returnableObject.error = true;
        return returnableObject
      } else {
        let user: Users | null = await Users.findOne({where: {id: id}});
        returnableObject.data = null;
        returnableObject.message = "No user found to update user!";
        returnableObject.error = true;
        if (user) {
          user.set({
            name: userInput.name
          })
          user = await user?.save();
          returnableObject.data = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
          };
          returnableObject.message = "Updated User!";
          returnableObject.error = false;
        }
        return returnableObject;
      }
    } catch (error: any) {
      // console.error('error', error)
      returnableObject.data = null;
      returnableObject.error = true;
      returnableObject.message = "Some error occurred while updating user!";
      return returnableObject
    }
  }

  /**
   * @description create user
   * @param {string} id the data coming from create user api 
   * @param {Users} user current user
   * @returns null user nd error as deleted or not
   */
  public static async delete(id: string, user: Users): Promise<Users | any> {
    let returnableObject: ReturnOneUser = new ReturnOneUser();
    try {
      if (!user.isAdmin) {
        returnableObject.data = null;
        returnableObject.message = "You are not authorized to perform this task!";
        returnableObject.error = true;
        return returnableObject
      } else {
        const toBeDeletedUser: Users = await Users.findOne({where: { id }}) as Users;
        if (toBeDeletedUser.isAdmin) {
          returnableObject.data = null;
          returnableObject.message = "You are not authorized to perform this task!";
          returnableObject.error = true;
          return returnableObject
        } else {
          await toBeDeletedUser.destroy();
          returnableObject.data = null;
          returnableObject.message = "User deleted!";
          returnableObject.error = false;
          return returnableObject;
        }
      }
    } catch (error: any) {
      // console.error('error', error)
      returnableObject.data = null;
      returnableObject.error = true;
      returnableObject.message = "Some error occurred while deleting user!";
      return returnableObject
    }
  }


}