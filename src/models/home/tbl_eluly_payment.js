export const tbl_eluly_payment = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_payment', {
    impUid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    merchantUid: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    term: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    designerName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    applyNum: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cardCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cardName: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    payMethod: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    action: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    payment: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);