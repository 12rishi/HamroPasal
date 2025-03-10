import { Response } from "express";
import { AuthRequest, ProductData } from "../types";
import Product from "../database/models/productModel";
import cloudinary from "../Middleware/cloudinary";
import { Sequelize } from "sequelize";
import { sanitizeMe } from "../services/sanitizeHtml";

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
    const sequelize = Product.sequelize;
    if (!sequelize) {
      return res.status(500).json({ message: "Database connection error." });
    }

    const transaction = await sequelize.transaction();
    try {
      let products: ProductData[] = [];

      // Parse and sanitize request body
      if (Array.isArray(req.body)) {
        products = req.body.map((product) =>
          this.parseProductData(sanitizeMe(product))
        );
      } else if (typeof req.body === "object" && req.body !== null) {
        products = [this.parseProductData(sanitizeMe(req.body))];
      } else {
        return res
          .status(400)
          .json({ message: "Invalid product data format." });
      }

      // Check if images are uploaded
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ message: "No images uploaded." });
      }

      // Validate each product
      for (const product of products) {
        const validationError = this.validateProduct(product);
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }
      }

      // Validate image files
      const fileChecked = this.checkFile(req.files as Express.Multer.File[]);
      if (fileChecked) {
        return res.status(400).json({ message: fileChecked });
      }

      // Upload images to Cloudinary
      const uploadedImages = await this.uploadImagesToCloudinary(
        req.files as Express.Multer.File[]
      );

      // Assign uploaded images to products
      products.forEach((product) => {
        product.productImage = uploadedImages;
      });

      // Insert data efficiently using bulkCreate within a transaction
      await Product.bulkCreate(products as any, { transaction });

      await transaction.commit(); // Commit transaction

      return res.status(201).json({
        message: "Products added successfully!",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback on failure
      console.error("Error adding product:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  }

  /**
   * Upload images to Cloudinary
   */
  private async uploadImagesToCloudinary(files: Express.Multer.File[]) {
    return Promise.all(
      files.map(async (file) => {
        const cloudUpload = await cloudinary.v2.uploader.upload(file.path);
        return {
          data: cloudUpload.url,
          contentType: file.mimetype,
          public_id: cloudUpload.public_id,
        };
      })
    );
  }

  /**
   * Parse JSON fields (keyFeatures, availableColors, productImage)
   */
  private parseProductData(product: any): ProductData {
    return {
      ...product,
      keyFeatures:
        typeof product.keyFeatures === "string"
          ? JSON.parse(product.keyFeatures)
          : product.keyFeatures,
      availableColors:
        typeof product.availableColors === "string"
          ? JSON.parse(product.availableColors)
          : product.availableColors,
      productImage:
        typeof product.productImage === "string"
          ? JSON.parse(product.productImage)
          : product.productImage,
    };
  }

  async getProduct(req: AuthRequest, res: Response) {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const limit = 10;
      const offset = (pageNumber - 1) * limit;

      // Fetch products and total count
      const [products, totalCount] = await Promise.all([
        Product.findAll({ limit, offset }),
        Product.count(),
      ]);

      // Parse productImage, keyFeatures, and availableColors into object/array form
      const parsedProducts = products.map((product) => ({
        ...product.toJSON(), // Convert Sequelize instance to plain object
        productImage:
          typeof product.productImage === "string"
            ? JSON.parse(product.productImage)
            : product.productImage,
        keyFeatures:
          typeof product.keyFeatures === "string"
            ? JSON.parse(product.keyFeatures)
            : product.keyFeatures,
        availableColors:
          typeof product.availableColors === "string"
            ? JSON.parse(product.availableColors)
            : product.availableColors,
      }));

      const totalPages = Math.ceil(totalCount / limit);

      return res.status(200).json({
        message: "Successfully fetched the data",
        data: {
          product: parsedProducts,
          totalPages,
          currentPage: pageNumber,
        },
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
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
