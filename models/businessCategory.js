module.exports = (sequelize, DataTypes) => {
    const BusinessCategory = sequelize.define('BusinessCategory', {
        business_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    BusinessCategory.associate = function(models) {
        BusinessCategory.belongsTo(models.Business, {
            foreignKey: 'business_id',
            as: 'categories'
        });
    };

    BusinessCategory.sync()

    return BusinessCategory;
}