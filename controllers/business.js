const {sequelize} = require("../models")
const businessServices = require('../services/business')
const businessCategoryServices = require('../services/businessCategory')
const businessCoordinateServices = require('../services/businessCoordinate')
const businessLocationServices = require('../services/businessLocation')
const {findCenterCoordinate} = require("../utils/functions");

module.exports = {
    getBusinessDetails: async (req, res) => {
        try {
            const business = await businessServices.findOne( {id: req.params.id}, true)
            if (!business) {
                return res.status(404).send({
                    status: false, message: `cannot found business with id: ${req.body.id}`, errors: []
                })
            }

            return res.send({
                status: true, message: "success search business data", data: business
            });
        } catch (errors) {
            console.log("Error getBusinessDetails:", errors)
            res.status(500).send({
                status: false, message: "internal server errors!", errors
            })
        }
    },

    getAllBusiness: async (req, res) => {
        try {
            const {page = 1, limit = 10, term, categories, latitude, longitude, radius, location, price, sort_by} = req.query;
            let coordinates = {
                latitude, longitude
            }

            const coordinatesLength = Object.values(coordinates).filter(coordinate => coordinate).length
            const isInvalidCoordinates = !coordinatesLength || coordinatesLength >= 1 && coordinatesLength < 2
            if (!coordinatesLength) {
                coordinates = null
            }
            if (isInvalidCoordinates) {
                return res.status(400).send({
                    status: false, message: "invalid location format", errors: []
                })
            }

            const businesses = await businessServices.findAll({
                limit, offset: (+page - 1) * +limit, term, categories, location, coordinates, radius, price, sort_by,
            });

            const centerCoordinate = findCenterCoordinate(JSON.parse(JSON.stringify(businesses.rows)).map(business => {
                return {
                    lat: business.coordinates.latitude, lng: business.coordinates.longitude,
                }
            }))

            return res.send({
                status: true, message: "success search business data", data: {
                    businesses: businesses.rows, region: {
                        center: {
                            latitude: centerCoordinate.lat, longitude: centerCoordinate.lng
                        }
                    }, total: businesses.count, current_page: +page,
                },

            });
        } catch (errors) {
            console.log("Error getAllBusiness:", errors)
            res.status(500).send({
                status: false, message: "internal server errors!", errors
            })
        }
    },

    createBusiness: async (req, res) => {
        const sqlTransaction = await sequelize.transaction()
        try {
            const {categories, coordinates, location,} = req.body
            delete req.body.categories
            delete req.body.coordinates
            delete req.body.location

            await businessServices.create({
                ...req.body, transactions: req.body.transactions?.join(',')
            }, sqlTransaction);
            await Promise.all(categories.map(async (category) => {
                await businessCategoryServices.create({business_id: req.body.id, ...category}, sqlTransaction);
            }))
            await businessCoordinateServices.create({business_id: req.body.id, ...coordinates}, sqlTransaction);
            await businessLocationServices.create({
                business_id: req.body.id, ...location, display_address: location?.display_address?.join(',')
            }, sqlTransaction);

            await sqlTransaction.commit()
            res.send({
                status: true, message: "success create business data",
            });
        } catch (errors) {
            console.log("Error createBusiness:", errors)
            await sqlTransaction.rollback();

            if (errors.errors) {
                return res.status(400).send({
                    status: false, message: "invalid request data!", errors: errors.errors.map(error => {
                        return {type: error.type, message: error.message}
                    }),
                });
            }

            res.status(500).send({
                status: false, message: "internal server errors!", errors: errors
            })
        }
    },

    updateBusiness: async (req, res) => {
        const sqlTransaction = await sequelize.transaction()
        try {
            const {categories, coordinates, location,} = req.body
            delete req.body.categories
            delete req.body.coordinates
            delete req.body.location

            const business = await businessServices.findOne({id: req.body.id})
            if (!business) {
                return res.status(404).send({
                    status: false, message: `cannot found business with id: ${req.body.id}`, errors: []
                })
            }

            if (req.body) {
                const updatePayload = req.body
                if (updatePayload.transactions) updatePayload.transactions = updatePayload.transactions?.join(',')
                await businessServices.update(updatePayload, {id: updatePayload.id}, sqlTransaction);
            }

            if (categories?.length) {
                await businessCategoryServices.destroy({business_id: req.body.id}, sqlTransaction)
                await Promise.all(categories.map(async (category) => {
                    await businessCategoryServices.create({business_id: req.body.id, ...category}, sqlTransaction);
                }))
            }

            if (coordinates) {
                await businessCoordinateServices.destroy({business_id: req.body.id}, sqlTransaction)
                await businessCoordinateServices.create({business_id: req.body.id, ...coordinates}, sqlTransaction);
            }
            if (location) {
                await businessLocationServices.update({
                    business_id: req.body.id, ...location, display_address: location?.display_address?.join(',')
                }, {business_id: req.body.id}, sqlTransaction);
            }

            await sqlTransaction.commit()
            res.send({
                status: true, message: "success update business data",
            });
        } catch (errors) {
            console.log("Error updateBusiness:", errors)
            await sqlTransaction.rollback();

            if (errors.errors) {
                return res.status(400).send({
                    status: false, message: "invalid request data!", errors: errors.errors.map(error => {
                        return {type: error.type, message: error.message}
                    }),
                });
            }

            res.status(500).send({
                status: false, message: "internal server errors!", errors: errors
            })
        }
    },

    deleteBusiness: async (req, res) => {
        const sqlTransaction = await sequelize.transaction()
        try {
            const business_id = req.params.id

            await businessServices.destroy({id: business_id}, sqlTransaction);
            await businessCategoryServices.destroy({business_id}, sqlTransaction)
            await businessCoordinateServices.destroy({business_id}, sqlTransaction)
            await businessLocationServices.destroy({business_id}, sqlTransaction)

            await sqlTransaction.commit()
            res.send({status: true, message: "success delete business data",})
        } catch (errors) {
            console.log("Error deleteBusiness:", errors)
            await sqlTransaction.rollback();

            if (errors.errors) {
                return res.status(400).send({
                    status: false, message: "invalid request data!", errors: errors.errors.map(error => {
                        return {type: error.type, message: error.message}
                    }),
                });
            }

            res.status(500).send({
                status: false, message: "internal server errors!", errors: errors
            })
        }
    }
}