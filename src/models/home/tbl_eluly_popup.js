export const tbl_eluly_popup = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_popup', {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);