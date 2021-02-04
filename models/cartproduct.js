'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Cart, { foreignKey: 'cart_id' })
      this.belongsTo(models.Product, { foreignKey: 'product_id' })
    }
  };
  CartProduct.init({
    cart_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartProduct',
  });
  return CartProduct;
};