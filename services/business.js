const {Op} = require("sequelize");
const {Business, BusinessCategory, BusinessCoordinate, BusinessLocation, sequelize} = require('../models');

module.exports = {
    findOne: async (options, withRelation = false) => {
        try {
            const params = {
                where: options,
            }

            if (withRelation) {
                params.include = [{
                    model: BusinessCategory, as: "categories", attributes: ["alias", "title"],
                }, {
                    model: BusinessCoordinate, as: "coordinates", attributes: ["latitude", "longitude"],
                }, {
                    model: BusinessLocation,
                    as: "location",
                    attributes: ["address1", "address2", "address3", "city", "country", "display_address", "state", "zip_code", "cross_streets",],
                }]
            }

            const business = await Business.findOne(params);
            return business;
        } catch (errors) {
            return errors
        }
    },

    findAll: async (options) => {
        try {
            const {limit, offset, term, price, categories, coordinates, location, radius, sort_by} = options;
            delete options.limit
            delete options.offset
            delete options.categories
            delete options.location
            delete options.coordinates
            delete options.radius
            delete options.term
            delete options.sort_by

            if (term) {
                options.name = {
                    [Op.iLike]: `%${term}%`
                }
            }

            if (price) {
                options.price = {
                    [Op.in]: price.split(",").map(p => {
                        return '$'.repeat(+p)
                    })
                }
            } else {
                delete options.price
            }

            const categoryOptions = {}
            if (categories) {
                categoryOptions.alias = {
                    [Op.in]: categories.split(',').map(category => {
                        return category
                    })
                }
            }

            const locationOptions = {}
            if (location) {
                locationOptions.display_address = {
                    [Op.iLike]:`%${location}%`
                }
            }

            const distanceQuery = `(
                    6371 * acos(
                        cos(radians(${coordinates.latitude}))
                        * cos(radians(latitude))
                        * cos(radians(longitude) - radians(${coordinates.longitude}))
                        + sin(radians(${coordinates.latitude})) * sin(radians(latitude))
                    )
                )`;

            let coordinateOptions = {}
            if (radius) {
                coordinateOptions = {
                    [Op.and]: [
                        sequelize.literal(`${distanceQuery} <= ${radius}`)
                    ]
                }
            }

            const sortOption = []
            switch (sort_by) {
                case "highest_rating":
                    sortOption.push(["rating", "DESC"])
                    break
                case "most_reviewed":
                    sortOption.push(["rating", "DESC"])
                    break
                case "nearest":
                    sortOption.push(["distance", "ASC"])
                    break
            }

            let businesses = await Business.findAndCountAll({
                where: options, limit, offset, include: [{
                    model: BusinessCategory, as: "categories", attributes: ["alias", "title"], where: categoryOptions
                }, {
                    model: BusinessCoordinate,
                    as: "coordinates",
                    attributes: ["latitude", "longitude", [sequelize.literal(distanceQuery), 'distance']],
                    where: coordinateOptions
                }, {
                    model: BusinessLocation,
                    as: "location",
                    attributes: ["address1", "address2", "address3", "city", "country", "display_address", "state", "zip_code", "cross_streets",],
                    where: locationOptions
                }], distinct: true, order: sortOption,
            });

            return businesses;
        } catch (errors) {
            console.log(errors)
            return errors
        }
    },

    create: async (payload, transaction) => {
        await Business.create(payload, {
            transaction
        });
    },

    update: async (payload, options, transaction) => {
        await Business.update(payload, {
            where: options, transaction,
        });
    },

    destroy: async (options, transaction) => {
        await Business.destroy({
            where: options, transaction,
        });
    },
}