import { AuthRequest, ICart } from "../types";
import { sanitizeMe } from "../services/sanitizeHtml";
import { Response } from "express";
import Cart from "../database/models/cartModel";
import { getRedisData, setRedisData } from "../services/redisService";
import Product from "../database/models/productModel";

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

    const cartData = await Cart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "productName",
            "productPrice",
            "description",
            "productImage",
          ],
        },
      ],
    });
    const newParsedData = cartData.map((data: any) => ({
      ...data.toJSON(),
      Product: {
        ...data.Product, // Spread data.Product, not the Model
        productImage: Array.isArray(data.Product.productImage)
          ? data.Product.productImage.map(
              (img: String | unknown) =>
                typeof img == "string" && JSON.parse(img)
            )
          : JSON.parse(data.Product.productImage), // Handle single image case
      },
    }));
    setRedisData("cart", `${req.user.id}`, JSON.stringify(newParsedData));

    return res
      .status(201)
      .json({ message: "Cart added successfully", data: newParsedData });
  }
  async getCart(req: AuthRequest, res: Response) {
    const { id } = req.user;
    const cart = await getRedisData("cart", id);
    console.log("cart data is", cart);
    if (cart.length > 0) {
      console.log("data from cached");
      return res.status(200).json({
        message: "successfully fetched cart item",
        data: cart,
      });
    }
    console.log("cache didnot hit");
    const cartData: any[] = await Cart.findAll({
      where: { userid: id },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "productName",
            "productPrice",
            "description",
            "productImage",
          ],
        },
      ],
    });
    const newParsedData = cartData.map((data) => ({
      ...data.toJSON(),
      Product: {
        ...data.Product, // Spread data.Product, not the Model
        productImage: Array.isArray(data.Product.productImage)
          ? data.Product.productImage.map(
              (img: String | unknown) =>
                typeof img == "string" && JSON.parse(img)
            )
          : JSON.parse(data.Product.productImage), // Handle single image case
      },
    }));

    console.log("cartData is", newParsedData);
    return res.status(200).json({
      message: "successfully fetched cart item",
      data: newParsedData,
    });
  }
}
export default new CartController();
