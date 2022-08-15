const { updateRecordStatus } = require("../lib/db");
const https = require('https');
module.exports.handler = async function imageProcess(event) {
    const { tid } = event;
    //const {images } = event ; // the images will come from the event in base 64 encoded format

    /*
            The image processing code goes here
    */


    const options = {
        hostname: 'https://wh31lknrql.execute-api.us-east-1.amazonaws.com/dev/dummyportal',
        path: '/dummyportal',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            images: ['base64 image1', 'base64 image2'], //put the image outputs here in base 64 encoded format
        })
    };

    const req = await https.request(options, async res => {
        if (res.statusCode == 200) {
            await updateRecordStatus(tid, "green");
            return {
                statusCode: 200,
                headers: {},
                body: JSON.stringify("Successfully uploaded to end portal")
            };

        } else {
            await updateRecordStatus(tid, "red");
            return {
                statusCode: 200,
                headers: {},
                body: JSON.stringify("Doc upload failed")
            };
        }
    });




}