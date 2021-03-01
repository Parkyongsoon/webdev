export const tbl_eluly_qnaComment = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_qnaComment', {
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