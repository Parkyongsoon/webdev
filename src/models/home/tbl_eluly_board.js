export const tbl_eluly_board = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_board', {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    files: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    filesOriginalName: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    contentImg: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);