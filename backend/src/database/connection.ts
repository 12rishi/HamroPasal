import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import Cart from "./models/cartModel";
import User from "./models/userModel";
import Product from "./models/productModel";
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
User.hasMany(Cart, {
  foreignKey: "userId",
});
Cart.belongsTo(User, {
  foreignKey: "userId",
});
Product.hasMany(Cart, {
  foreignKey: "productId",
});
Cart.belongsTo(Product, { foreignKey: "productId" });
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
