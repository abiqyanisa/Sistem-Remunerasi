function cleanSequelizeData(data) {
    if (Array.isArray(data)) {
        return data.map(cleanSequelizeData);
    }

    // Convert Sequelize instance ke plain object
    if (data && typeof data.get === 'function') {
        return cleanSequelizeData(data.get({ plain: true }));
    }

    if (data !== null && typeof data === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            if (!['_previousDataValues', '_options', 'isNewRecord'].includes(key)) {
                result[key] = cleanSequelizeData(value);
            }
        }
        return result;
    }

    return data;
}

function trimAllStrings(obj) {
    if (Array.isArray(obj)) {
        return obj.map(trimAllStrings);
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, trimAllStrings(value)])
        );
    }

    if (typeof obj === 'string') {
        return obj.trim();
    }

    return obj;
}

function trimResponse(req, res, next) {
    const originalJson = res.json;

    res.json = function (data) {
        // Bersihkan Sequelize metadata, lalu trim semua string
        const plainData = cleanSequelizeData(data);
        const trimmedData = trimAllStrings(plainData);
        return originalJson.call(this, trimmedData);
    };

    next();
}

export default trimResponse;