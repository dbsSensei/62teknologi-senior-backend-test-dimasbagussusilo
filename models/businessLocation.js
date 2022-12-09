module.exports = (sequelize, DataTypes) => {
    const BusinessLocation = sequelize.define('BusinessLocation', {
        business_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address1: {
            type: DataTypes.STRING,
        },
        address2: {
            type: DataTypes.STRING,
        },
        address3: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        country: {
            type: DataTypes.STRING,
        },
        display_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
        },
        zip_code: {
            type: DataTypes.STRING,
        },
        cross_streets: {
            type: DataTypes.STRING,
        },
    });

    BusinessLocation.associate = function (models) {
        BusinessLocation.belongsTo(models.Business, {
            foreignKey: 'business_id',
            as: 'location'
        });
    };

    BusinessLocation.sync()

    return BusinessLocation;
}