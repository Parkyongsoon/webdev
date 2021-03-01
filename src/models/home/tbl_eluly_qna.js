export const tbl_eluly_qna = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_qna', {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);