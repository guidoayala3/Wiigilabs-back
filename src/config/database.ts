import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Faltan variables de entorno para la conexión a la base de datos");
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false, 
});

export default sequelize;
