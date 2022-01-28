'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Wishlist, PriceRange, WishPhoto, User, Group}) {
      this.belongsTo(Wishlist, {foreignKey:"wishlist_id"})
      this.belongsTo(PriceRange,{foreignKey:"pricerange_id"})
      this.hasOne(WishPhoto,{foreignKey:"wish_id", onDelete: 'cascade'})
      this.belongsTo(User, {foreignKey:"user_id"})
      this.hasOne(Group,{foreignKey:"wish_id", onDelete: 'cascade'})
    }
  };
  Wish.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    isBinded: DataTypes.BOOLEAN,
    user_id: {
      defaultValue:null,
      type: DataTypes.INTEGER
    },
    isGiven: DataTypes.BOOLEAN,
    pricerange_id: DataTypes.INTEGER,
    wishlist_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wish',
  });
  return Wish;
};
