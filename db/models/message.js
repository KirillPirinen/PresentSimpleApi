'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Group, User}) {
      this.belongsTo(Group, {foreignKey:'group_id', onDelete:'CASCADE'})
      this.belongsTo(User, {foreignKey:'user_id'})
    }
  };
  Message.init({
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
