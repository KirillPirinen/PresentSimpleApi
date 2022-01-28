'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Wish}) {
      this.belongsTo(Wish, {foreignKey:"wish_id", onDelete: 'cascade'})
    }
  };
  WishPhoto.init({
    image: DataTypes.STRING,
    wish_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'WishPhoto',
  });
  return WishPhoto;
};
