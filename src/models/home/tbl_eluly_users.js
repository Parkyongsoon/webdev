export const tbl_eluly_users = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_users', {
    username: {
      type: DataTypes.STRING(40),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    detailAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    extraAddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local'
    },
    snsId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    portfolioFile: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    portfolioFileOriginalName: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull:true
    },
    major: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    career: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    cok: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    loginDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('customer', 'designer'),
      defalutValue: 'customer',
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);