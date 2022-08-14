// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { createDbUser } = require("../lib/db");

module.exports.handler = async function registerUser(event) {
    var body = {};
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        return {
            "cookies": [],
            "isBase64Encoded": false,
            "statusCode": 400,
            "headers": {
                "Content-Type ": "application/json"
            },
            "body": { "message": "Invalid JSON" }
        };
    }

    return createDbUser(body)
        .then(user => ({
            isBase64Encoded: true,
            statusCode: 200,
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(user)
        }))
        .catch(err => {
            console.log({ err });

            return {
                isBase64Encoded: true,
                statusCode: err.statusCode || 500,
                headers: { "Content-Type": "text/plain" },
                body: { message: err.message }
            };
        });
};