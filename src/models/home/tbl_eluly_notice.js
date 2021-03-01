export const tbl_eluly_notice = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_notice', {
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
    },
    noti: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);