export const tbl_eluly_boardComment = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_boardComment', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }    
  }, {
    timestamps: true,
    paranoid: true
  })
);