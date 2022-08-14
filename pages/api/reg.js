// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { createDbUser } = require("../lib/db");

module.exports.handler = async function registerUser(event) {
    var body = {};
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        return {

            isBase64Encoded: false,
            statusCode: 400,
            headers: {
                "Content-Type ": "application/json"
            },
            body: JSON.stringify({ "message": "Invalid JSON" })
        };
    }

    return createDbUser(body)
        .then(user => ({
            isBase64Encoded: false,
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: "Created user successfully"
        }))
        .catch(err => ({
            isBase64Encoded: false,
            statusCode: err.statusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: err.message })

        }));
};