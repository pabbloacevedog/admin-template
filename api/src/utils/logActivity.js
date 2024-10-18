// src/utils/logActivity.js
import models from '../models/index.js';

export const logActivity = async (userId, action, resource, data_before, data_current) => {
    try {
        await models.ActivityLog.create({
            user_id: userId,
            action,
            resource,
            data_before,
            data_current,
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};
