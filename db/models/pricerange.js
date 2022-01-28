'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceRange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Wish, Present}) {
      this.hasMany(Wish, {foreignKey:"pricerange_id"})
      this.hasMany(Present, {foreignKey:"pricerange_id"})
    }
  };
  PriceRange.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PriceRange',
  });
  return PriceRange;
};
