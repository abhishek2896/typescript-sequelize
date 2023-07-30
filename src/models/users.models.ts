import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/db_config';

interface UserAttributes {
  id?: string;
  name?: string;
  email: string;
  isAdmin: boolean;
  salt?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOuput extends Required<UserAttributes> {}




class Users extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: string
  public name!: string
  public email!: string
  public isAdmin!: boolean;
  public salt!: string
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;


}

Users.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true,
  tableName: 'users',
})

export default Users;