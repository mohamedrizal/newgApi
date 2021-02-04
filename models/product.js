'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CartProduct, { foreignKey: 'product_id' })
      this.belongsTo(models.Category, { foreignKey: 'category_id' })
      this.hasMany(models.OrderProduct, { foreignKey: 'productId' })
    }
  };
  Product.init({
    productName: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};