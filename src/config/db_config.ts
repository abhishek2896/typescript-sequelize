import { Dialect, OperatorsAliases, Sequelize } from 'sequelize';
import config from './config';


const DBURL = config.db;
const dbConfig = {
  USER: DBURL.split('//')[1].split(':')[0],
  PASSWORD: DBURL.split('//')[1].split(':')[1].split('@')[0],
  HOST: DBURL.split('@')[1].split(':')[0],
  PORT: DBURL.split('@')[1].split(':')[1].split('/')[0],
  DB: DBURL.split('@')[1].split(':')[1].split('/')[1],
  dialect: 'postgres' as Dialect,
  logging: config.logging,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
}


const sequelizeConnection = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0 as unknown as OperatorsAliases,
  logging: dbConfig.logging as boolean,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

export default sequelizeConnection;