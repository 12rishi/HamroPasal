import { AuthRequest, ICart } from "../types";
import { sanitizeMe } from "../services/sanitizeHtml";
import { Response } from "express";
import Cart from "../database/models/cartModel";
import { getRedisData, setRedisData } from "../services/redisService";

class CartController {
  async addCart(req: AuthRequest, res: Response): Promise<Response> {
    const data: ICart[] = sanitizeMe(req.body);

    for (const item of data) {
      if (!item.quantity || !item.productId || item.quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Please provide all required cart details." });
      }
      (item.userId as number | any) = req.user.id; // Assign userId to each item
    }

    await Cart.sequelize?.transaction(async (t) => {
      await Cart.bulkCreate(data as any, { transaction: t });
    });
    const cartData = await Cart.findAll({ where: { userid: req.user.id } });
    setRedisData("cart", `${req.user.id}`, JSON.stringify(cartData));

    return res.status(201).json({ message: "Cart added successfully" });
  }
  async getCart(req: AuthRequest, res: Response) {
    const { id } = req.user;
    const cart = await getRedisData("cart", id);
    if (cart.length > 0) {
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
