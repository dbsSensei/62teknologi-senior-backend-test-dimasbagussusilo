const {BusinessCategory} = require('../models');

module.exports = {
    create: async (payload, transaction) => {
        await BusinessCategory.create(payload, {
            transaction
        });
    },

    destroy: async (options, transaction) => {
        await BusinessCategory.destroy({
            where: options, transaction,
        });
    },
}