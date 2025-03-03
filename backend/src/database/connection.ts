import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 60000,
  },
  username: process.env.DB_USERNAME,
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  models: [__dirname + "/models"],
});
sequelize
  .authenticate()
  .then(() => {
    console.log("successfully connected to db");
  })
  .catch((err: Error) => {
    console.log(err?.message);
  });
sequelize.sync({ force: false }).then(() => {
  console.log("successfully sync");
});
