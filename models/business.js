module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactions: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    display_phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distance: {
      type: DataTypes.STRING,
    },
  });

  Business.associate = function(models) {
    Business.hasMany(models.BusinessCategory, {
      foreignKey: 'business_id',
      as: 'categories'
    });
    Business.hasOne(models.BusinessCoordinate, {
      foreignKey: 'business_id',
      as: 'coordinates'
    });
    Business.hasOne(models.BusinessLocation, {
      foreignKey: 'business_id',
      as: 'location'
    });
  };

  Business.sync()

  return Business;
}