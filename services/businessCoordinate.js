const {BusinessCoordinate} = require('../models');

module.exports = {
    create: async (payload, transaction) => {
        console.log("payload", payload)
        await BusinessCoordinate.create(payload, {
            transaction
        });
    },

    destroy: async (options, transaction) => {
        await BusinessCoordinate.destroy({
            where: options, transaction,
        });
    },
}