import { Response } from "express";
import { AuthRequest, ProductData } from "../types";
import Product from "../database/models/productModel";
import cloudinary from "../Middleware/cloudinary";
import { Sequelize } from "sequelize";

class ProductController {
  private validateProduct(product: ProductData): string | null {
    const {
      productName,
      productPrevPrice,
      productPrice,
      description,
      owner,
      keyFeatures,
      availableColors,
    } = product;

    if (
      !productName ||
      !productPrevPrice ||
      !productPrice ||
      !owner ||
      !description ||
      !Array.isArray(availableColors) ||
      availableColors.length === 0 ||
      !Array.isArray(keyFeatures) ||
      keyFeatures.length === 0
    ) {
      return "Please provide all required product details.";
    }
    return null; // No errors
  }
  private checkFile(files: Express.Multer.File[]): string | null {
    for (let file of files) {
      if (file.size > 2 * 1024 * 1024) {
        return `file with ${file.originalname} should be less than 2MB`;
      }
    }
    return null;
  }
  async addProduct(req: AuthRequest, res: Response) {
    const transaction = await Product.sequelize?.transaction();
    try {
      let products: ProductData[] = [];

      // Handle both single object and array input
      if (Array.isArray(req.body)) {
        products = req.body;
      } else if (typeof req.body === "object" && req.body !== null) {
        products = [req.body]; // Convert single object to array
      } else {
        return res
          .status(400)
          .json({ message: "Invalid product data format." });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: "No images uploaded." });
      }

      // Validate all products
      for (const product of products) {
        const validationError = this.validateProduct(product);
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }
      }
      const fileChecked = this.checkFile(req.files as Express.Multer.File[]);
      if (fileChecked) {
        return res.status(400).json({
          message: fileChecked,
        });
      }

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        (req.files as Express.Multer.File[]).map(async (file) => {
          const cloudUpload = await cloudinary.v2.uploader.upload(file.path);
          return {
            data: cloudUpload.url,
            contentType: file.mimetype,
            public_id: cloudUpload.public_id,
          };
        })
      );

      // Assign uploaded images to products
      products.forEach((product) => {
        product.productImage = uploadedImages; // Assign images to product
      });

      // Insert data efficiently using bulkCreate within a transaction

      await transaction?.commit(); // Commit transaction

      return res.status(201).json({
        message: "Products added successfully!",
      });
    } catch (error) {
      await transaction?.rollback(); // Rollback in case of failure
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  }
  async getProduct(req: AuthRequest, res: Response) {
    const pageNumber = Number(req.query.page) || 1;
    const limit = 10;
    const offset = (pageNumber - 1) * limit;
    const [product, totalCount] = await Promise.all([
      await Product.findAll({ limit, offset }),
      await Product.count(),
    ]);
    const totalPage = totalCount / limit;
    return res.status(200).json({
      message: "successfully fetched the data",
      data: {
        product,
        totalPage,
        currentPage: pageNumber,
      },
    });
  }
  async updateProduct(req: AuthRequest, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateValue: any = req.body;
    if (!id) {
      res.status(400).json({
        message: "please provide an id",
      });
    }

    if (req.files) {
      const data = await Product.findByPk(id);
      if (data?.productImage?.length) {
        const dataImage = data.productImage.map((val) => val.public_id);

        await Promise.all(
          dataImage.map((val: any) => cloudinary.v2.uploader.destroy(val))
        );
        const updateImages = await Promise.all(
          (req.files as Express.Multer.File[]).map(async (val) => {
            const imageData = await cloudinary.v2.uploader.upload(val.path);
            return {
              data: imageData.url,
              contentType: val.mimetype,
              public_id: imageData.public_id,
            };
          })
        );
        const updateData = await Product.update(
          {
            productName: updateValue.productName,
            productPrice: updateValue.productPrice,
            productPrevPrice: updateValue.productPrevPrice,
            owner: updateValue.owner,
            keyFeatures: updateValue.keyFeatures,
            description: updateValue.description,
            productImages: updateImages,
          },
          {
            where: { id: id },
          }
        );

        return res.status(200).json({
          message: "updated successfully",
          data: updateData,
        });
      }
    }
    const updateData = await Product.update(
      {
        productName: updateValue.productName,
        productPrice: updateValue.productPrice,
        productPrevPrice: updateValue.productPrevPrice,
        owner: updateValue.owner,
        keyFeatures: updateValue.keyFeatures,
        description: updateValue.description,
      },
      {
        where: { id: id },
      }
    );

    return res.status(200).json({
      message: "updated successfully",
      data: updateData,
    });
  }
}

export default new ProductController();
