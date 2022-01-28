'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      this.belongsTo(User, {foreignKey:"user_id"})
    }
  };
  ResetPassword.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResetPassword',
  });
  return ResetPassword;
};
