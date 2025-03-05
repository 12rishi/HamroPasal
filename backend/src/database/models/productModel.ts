import {
  Column,
  DataType,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["productId"], // Indexing productId for faster searches
    },
  ],
})
class Product extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.JSON, // Store array of objects
    allowNull: false,
  })
  declare productImage: {
    data: string;
    contentType: string;
    public_id: string;
  }[];
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare productPrice: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare productPrevPrice: number;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  declare availableColors: string[];
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare owner: string;
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  declare keyFeatures: string[];
}

export default Product;
