const { getUserByEmail } = require("../lib/db");
const { getUserFromToken } = require("../lib/utils");
const { putRecordtoDb } = require("../lib/db");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");



module.exports.handler = async function(event) {
    try {

        const userObj = await getUserFromToken(event.headers.authtoken);

        const { email, numberOfPages, images, docName } = JSON.parse(event.body);

        if (docName == undefined) {
            var err = Error("Please Provide the Document Name");
            err.statusCode = 400;
            throw err;
        }
        const dbUser = await getUserByEmail(email);

        const tid4 = uuidv4();
        /* creating yellow log */

        await putRecordtoDb({
            tid: tid4,
            email: email,
            numberOfPages: numberOfPages,
            status: "yellow",
            docName: docName,
        });

        /*invoking async lambda */
        const payload = {
            tid: tid4,
            email: email,
            numberOfPages: numberOfPages,
            images: images,
        }
        var lambda = new AWS.Lambda();

        var params = {

            FunctionName: 'serverless-jwt-authorizer-dev-imageProcessing',
            Payload: JSON.stringify(payload),
            InvocationType: 'RequestResponse',
        };
        //verify whether the sync lambda does not wait for the async lambda to complete
        const resp = await lambda.invoke(params // successful response
        ).promise();
        console.log("resp from lambda" + resp);



        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({
                base64encoded: false,
                tid: tid4,
                message: "Yellow confirmed",
            })
        };
    } catch (err) {
        return {
            statusCode: err.statusCode || 500,
            headers: {},
            body: JSON.stringify({
                base64encoded: false,
                message: err.message,
            })
        }

    }
}