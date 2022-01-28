'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Wish, User}) {
     this.belongsTo(User, {foreignKey:"user_id"}),
     this.hasMany(Wish, {foreignKey:"wishlist_id"})
    }
  };
  Wishlist.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};
