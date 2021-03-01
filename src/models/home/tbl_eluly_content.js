export const tbl_eluly_content = (sequelize, DataTypes) => (
  sequelize.define('tbl_eluly_content', {
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
    apply: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    action: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    choice: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: true,
    paranoid: true
  })
);