'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({Wish, Wishlist, Form, Present, Group, UserGroup, ResetPassword, Message}) {
      this.hasOne(Wishlist, {foreignKey:"user_id"})
      this.hasMany(Form, {foreignKey:"user_id"})
      this.hasMany(Present, {foreignKey:"user_id"})
      this.hasMany(Wish, {foreignKey:"user_id"})
      this.belongsToMany(Group, {through:UserGroup, foreignKey:"user_id", otherKey: 'group_id'})
      this.hasOne(ResetPassword, {foreignKey:"user_id"})
      this.hasMany(Message, {foreignKey:'user_id'})
      this.hasMany(Group, {as:'Admin', foreignKey:'admin_id'})
    }
  };
  User.init({
    name: DataTypes.STRING,
    lname: DataTypes.STRING,
    phone: {
      unique:true,
      type:DataTypes.STRING,
      validate:{
      len: {
        args: 11,
        msg: "Phone number should be 11 symbols"
      },
      }
    },
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail:true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    },
    avatar: DataTypes.STRING,
    isConfirmed: DataTypes.BOOLEAN
  }, 
  {
    sequelize,
    modelName: 'User',
  });
  return User;
};
