'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Present extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Form, PriceRange, User}) {
      this.belongsTo(Form, {foreignKey:"form_id"})
      this.belongsTo(PriceRange,{foreignKey:"pricerange_id"})
      this.belongsTo(User, {foreignKey:"user_id"})
    }
  };
  Present.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    isBinded: DataTypes.BOOLEAN,
    isGiven: DataTypes.BOOLEAN,
    form_id: DataTypes.UUID,
    pricerange_id: DataTypes.INTEGER,
    user_id: {
      defaultValue:null,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Present',
  });
  return Present;
};
