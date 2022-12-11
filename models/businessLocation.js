module.exports = (sequelize, DataTypes) => {
    const BusinessLocation = sequelize.define('BusinessLocation', {
        business_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        display_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zip_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cross_streets: {
            type: DataTypes.STRING,
            allowNull: false,
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