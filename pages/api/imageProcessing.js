const { updateRecordStatus } = require("../lib/db");
const https = require('https');


function postRequest(body) {
    const options = {
        hostname: 'wh31lknrql.execute-api.us-east-1.amazonaws.com',
        path: '/dev/dummyportal',
        method: 'POST',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let rawData = '';

            res.on('data', chunk => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    console.log(rawData);
                    resolve(JSON.parse(rawData));
                } catch (err) {
                    reject(new Error(err));
                }
            });
        });

        req.on('error', err => {
            reject(new Error(err));
        });
        req.write(JSON.stringify(body));
        req.end();
    });
}



module.exports.handler = async function imageProcessing(event) {
    const { tid, email } = event;
    const { images } = event; // the images will come from the event in base 64 encoded format

    try {
        const resp = await postRequest({
            email: email,
            images: ["image1", "image2"] // the images will come from the event in base 64 encoded format]
        });
        console.log("resp from dummy portal" + JSON.stringify(resp));
        if (resp.statusCode == 200) {
            await updateRecordStatus(tid, "green");
            return {
                statusCode: 200,
                headers: {},
                body: JSON.stringify("Successfully uploaded to end portal")
            };
        } else {
            console.log("StatusCode response" + resp.statusCode);
            await updateRecordStatus(tid, "red");
            return {
                statusCode: 400,
                headers: {},
                body: JSON.stringify("Failed to upload to end portal")
            };
        }
    } catch (err) {
        console.log('Error is: 👉️', err);
        return {
            statusCode: 400,
            body: err.message,
        };
    }





}