import { AuthRequest, ICart } from "../types";
import { sanitizeMe } from "../services/sanitizeHtml";
import { Response } from "express";
import Cart from "../database/models/cartModel";
import { getRedisData, setRedisData } from "../services/redisService";

class CartController {
  async addCart(req: AuthRequest, res: Response): Promise<Response> {
    const data: ICart[] = await sanitizeMe([req.body]);
    console.log("data is", data);

    for (const item of data) {
      if (!item.quantity || !item.productId || item.quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Please provide all required cart details." });
      }
      (item.userId as number | any) = req.user.id; // Assign userId to each item
    }
    const checkCart = await Cart.findOne({
      where: { userId: req.user.id, productId: data[0].productId },
    });
    if (!checkCart) {
      await Cart.sequelize?.transaction(async (t) => {
        await Cart.bulkCreate(data as any, { transaction: t });
      });
    } else {
      await Cart.update(
        { quantity: Number(checkCart.quantity) + Number(data[0].quantity) },
        { where: { userId: req.user.id, productId: data[0].productId } }
      );
    }

    const cartData = await Cart.findAll({ where: { userId: req.user.id } });
    setRedisData("cart", `${req.user.id}`, JSON.stringify(cartData));

    return res
      .status(201)
      .json({ message: "Cart added successfully", data: cartData });
  }
  async getCart(req: AuthRequest, res: Response) {
    const { id } = req.user;
    const cart = await getRedisData("cart", id);
    console.log("cart data is", cart);
    if (cart && cart.length > 0) {
      console.log("data from cached");
      return res.status(200).json({
        message: "successfully fetched cart item",
        data: cart,
      });
    }
    console.log("cache didnot hit");
    const cartData = await Cart.findAll({ where: { userid: id } });

    return res.status(200).json({
      message: "successfully fetched cart item",
      data: cartData,
    });
  }
}
export default new CartController();
