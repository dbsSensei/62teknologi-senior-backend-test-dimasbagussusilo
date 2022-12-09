const {BusinessLocation, Business} = require('../models');

module.exports = {
    create: async (payload, transaction) => {
        await BusinessLocation.create(payload, {
            transaction
        });
    },

    update: async (payload, options, transaction) => {
        await BusinessLocation.create(payload, {
            where: options, transaction
        });
    },

    destroy: async (options, transaction) => {
        await BusinessLocation.destroy({
            where: options, transaction,
        });
    },
}