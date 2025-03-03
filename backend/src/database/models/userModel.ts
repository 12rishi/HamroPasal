import {
  Column,
  DataType,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "USer",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["email"],
    },
  ],
})
class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}
export default User;
