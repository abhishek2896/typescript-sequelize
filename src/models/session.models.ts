import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/db_config';

interface SessionAttributes {
  id?: string;
  accessToken: string;
  userId: string;
  ttl: number;
  createdAt?: Date;
}
export interface SessionInput extends Optional<SessionAttributes, 'id'> {}
export interface SessionOuput extends Required<SessionAttributes> {}




class Sessions extends Model<SessionAttributes, SessionInput> implements SessionAttributes {
  public id!: string
  public accessToken!: string
  public userId!: string
  public ttl!: number

  public readonly createdAt!: Date;


}

Sessions.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ttl: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: false,
  tableName: 'sessions',
})

export default Sessions;