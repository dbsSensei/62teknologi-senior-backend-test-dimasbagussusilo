module.exports = (sequelize, DataTypes) => {
    const BusinessCoordinate = sequelize.define('BusinessCoordinate', {
        business_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    BusinessCoordinate.associate = function(models) {
        BusinessCoordinate.belongsTo(models.Business, {
            foreignKey: 'business_id',
            as: 'coordinates'
        });
    };

    BusinessCoordinate.sync()

    return BusinessCoordinate;
}