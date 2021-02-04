'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' })
      this.hasMany(models.OrderProduct, { foreignKey: 'orderId' })
    }
  };
  Order.init({
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    uniqId: DataTypes.STRING,
    subTotal: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};