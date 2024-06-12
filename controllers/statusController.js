// controllers/statusController.js

const statusService = require('../services/statusService');
const logger = require('../middleware/logger');

exports.getStatus = async (req, res, next) => {
    try {
        const dbStatus = await statusService.getDbStatus();

        const serviceStatus = dbStatus.database === 'connected' ? 'OK' : 'down';
        
        if (serviceStatus === 'fail') {
            logger.error(`Server status: ${JSON.stringify(serviceStatus)}. Details: ${JSON.stringify(dbStatus)}`);
            res.status(500).json({ status:serviceStatus, details: dbStatus });
        } else {
            logger.info(`Server status: ${JSON.stringify(serviceStatus)}. Details: ${JSON.stringify(dbStatus)}`);
            res.status(200).json({ status:serviceStatus, details: dbStatus });
        }
    } catch (error) {
        logger.error('Error while attempting to check server status', error);
        next(error);
    }
};
