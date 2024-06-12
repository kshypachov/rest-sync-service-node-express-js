// services/statusService.js

const models = require('../models/index');

exports.getDbStatus = async () => {
    try {
        await models.sequelize.authenticate();
        return { database: 'connected' };
    } catch (error) {
        return { database: 'disconnected', error: error.message };
    }
};
