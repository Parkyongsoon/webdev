export const tbl_eluly_admin = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_admin', {
    username: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defalutValue: false,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);