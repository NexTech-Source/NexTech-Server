const { login } = require("../lib/utils");
//TODO: https://dev.to/mabaranowski/nextjs-authentication-jwt-refresh-token-rotation-with-nextauthjs-5696
module.exports.handler = async function signInUser(event) {
    var body = {};
    try {
        body = JSON.parse(event.body);
        console.log(JSON.stringify(body));
    } catch (err) {
        return {
            isBase64Encoded: false,
            statusCode: 400,
            headers: {
                "Content-Type ": "application/json"
            },
            "body": JSON.stringify({ "message": "Invalid JSON" })
        };
    }

    return login(body)
        .then(session => ({
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
                "Content-Type ": "application/json"
            },
            body: JSON.stringify(session)
        }))
        .catch(err => {
            console.log({ err });
            return {

                isBase64Encoded: false,
                statusCode: err.statusCode || 500,
                headers: {
                    "Content-Type ": "application/json"
                },
                body: JSON.stringify({
                    "message ": err.message
                })
            };
        });

};