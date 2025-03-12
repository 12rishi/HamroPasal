import { InstanceError, Utils } from "sequelize";
import { ISocketProductCartData } from "../types";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import dotenv from "dotenv";
import fs from "fs";
import User from "../database/models/userModel";
import Cart from "../database/models/cartModel";
import redisClient, {
  deleteRedisData,
  setRedisData,
} from "../services/redisService";
import Product from "../database/models/productModel";
import { decode } from "punycode";
dotenv.config();

const socketController = (io: any) => {
  io.on("connection", async (socket: any) => {
    console.log("socket id is", socket.id);
    let token;
    if (socket.handshake.auth.token) {
      token = socket.handshake.auth?.token as string;
      if (!token || token === "" || token === undefined) {
        socket.emit("unauthorized", {
          message: "Unauthorized",
          status: 401,
        });
        socket.disconnect();
        return;
      }
    }
    const publicKey = fs.readFileSync(process.env.PUBLICKEY as any, "utf-8");
    //@ts-ignore
    const decoded = await promisify(jwt.verify)(token, publicKey, {
      algorithms: [process.env.ALGO as any],
    });
    console.log("decoded value is", decoded);
    if (!decoded) {
      socket.emit("unauthorized", {
        message: "Unauthorized",
        status: 401,
      });
      socket.disconnect();
      return;
    }
    //@ts-ignore
    const userExist = await User.findByPk(decoded.id);

    if (!userExist) {
      socket.emit("unauthorized", {
        message: "Unauthorized",
        status: 401,
      });
      socket.disconnect();
      return;
    }

    socket.on("updateCart", async (data: ISocketProductCartData) => {
      const { id, quantity } = data;
      await Cart.update({ quantity }, { where: { id } });
      //now lets update on redis cache
      const cartData = await Cart.findAll({ where: { userid: userExist.id } });
      await setRedisData("cart", `${userExist.id}`, JSON.stringify(cartData));
      socket.emit("resUpdateCart", {
        message: "Cart updated successfully",
        status: 200,
      });
    });
    socket.on("deleteCart", async (data: ISocketProductCartData) => {
      const { id } = data;
      await Cart.destroy({ where: { id } });
      //now lets update on redis cache
      const cartData = await Cart.findAll({ where: { userid: userExist.id } });
      deleteRedisData("cart", `${userExist.id}`);
      setRedisData("cart", `${userExist.id}`, JSON.stringify(cartData));

      socket.emit("resDeleteCart", {
        message: "Cart deleted successfully",
        status: 200,
      });
    });
    socket.on("deleteProduct", async (data: ISocketProductCartData) => {
      const { id } = data;
      await Product.destroy({ where: { id } });
      await setRedisData(
        "products",
        "all",
        JSON.stringify(await Product.findAll())
      );
      socket.emit("resDeleteProduct", {
        message: "Product deleted successfully",
        status: 200,
      });
    });

    socket.on("disconnection", () => {
      console.log("user disconnected", socket.id);
    });
  });
};
export default socketController;
