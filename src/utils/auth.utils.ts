import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export default class AuthUtils {

    /**
     * @description generate time based salt
     * @returns time based salt
     */
    public static generateSalt = (): string => {
      return Math.round((new Date().valueOf() * Math.random())) + '';
    }

    /**
     * @description encrypt given password using given salt
     * @param {string} password the password to be encrypted
     * @param {string} salt the salt to be used for encryption
     * @returns encrypted password
     */
    public static encryptPassword = (password: string, salt: string): string => {
      if (!password) return '';
      try {
        return crypto.createHmac('sha1', salt).update(password).digest('hex')
      } catch (err) {
        return '';
      }
    };
    
    /**
     * @description check if given plain text is encrypted with given salt is equal to given password
     * @param {string} plainText the plain text to be encrypted
     * @param {string} salt the salt to be used for encryption
     * @param {string} password the password to be compared
     * @returns true if password is equal to encrypted plain text
     */
    public static authenticate = (plainText: string, salt: string, password: string): boolean => {
      return this.encryptPassword(plainText, salt) === password;
    };

    /**
     * @description generate access token
     * @param {string} id id to be encryped in the token
     * @param {string} email email to be encryped in the token
     * @param {string} name name to be encryped in the token
     * @returns access token
     */
    public static generateAccessToken = (id: string, email: string, name: string): string => {
      return jwt.sign({
        id,
        name,
        email
      }, config.jwtSecret)
    };
}