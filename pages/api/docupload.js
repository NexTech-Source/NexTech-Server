const { getUserByEmail } = require("../lib/db");
const { getUserFromToken } = require("../lib/utils");
const { putRecordtoDb } = require("../lib/db");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");


module.exports.handler = async function(event) {
    const userObj = await getUserFromToken(event.headers.Authorization);
    const dbUser = await getUserByEmail(userObj.epk);
    const { email, numberOfPages, images } = JSON.parse(event.body);
    const tid = uuidv4();
    /* creating yellow log */
    putRecordtoDb({
        tid: tid,
        email: email,
        numberOfPages: numberOfPages,
        status: "yellow",
    });
    /*invoking async lambda */
    const payload = {
        tid: tid,
        email: email,
        numberOfPages: numberOfPages,
        images: images,
    }
    var lambda = new AWS.Lambda();
    var params = {
        FunctionName: 'imageProcessing',
        Payload: JSON.stringify(payload),
        InvocationType: 'Event',
    };
    await lambda.invoke(params // successful response
    ).promise();

    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify(dbUser.id)
    };
};