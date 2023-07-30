import { Request } from "express";
import { Users } from "../models";

export class UserObject {
    id!: string;
    name?: string;
    email!: string;
    isAdmin!: boolean;
    createdAt!: Date;

}

export class ReturnOneUser {
    error!: boolean;
    message!: string;
    data!: UserObject | null;
}

export class ReturnManyUsers {
    error!: boolean;
    message!: string;
    data!: UserObject[] | null;
}

class TokenData {
    access_token!: string;
}

export class ReturnLoginToken {
    error!: boolean;
    message!: string;
    data!: TokenData;
}

export interface NewRequest extends Request {
    user?: Users | null;
}

export class SearchUserInput {
    search?: string;
    page!: number;
    limit!: number;
}