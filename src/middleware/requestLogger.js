const db = require('../controllers/database');

const logRequest = (req, res, next) => {
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks = [];

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        defaultWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString('utf8');

        logToDatabase(req, res, body);  // Log the request and response to the database

        defaultEnd.apply(res, restArgs);
    };

    next();
};

const logToDatabase = (req, res, responseBody) => {
    const sql = `
        INSERT INTO request_logs (method, url, body, response_status, response_body)
        VALUES (?, ?, ?, ?, ?)
    `;
    const body = JSON.stringify(req.body);
    const params = [
        req.method,
        req.originalUrl || req.url,
        body,
        res.statusCode,
        responseBody
    ];

    db.run(sql, params, err => {
        if (err) {
            console.error('Failed to log request:', err);
        }
    });
};

module.exports = logRequest;
