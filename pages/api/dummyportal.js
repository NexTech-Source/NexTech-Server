module.exports.handler = async function dummyportal(event) {
    //TODO: add event check later 
    const { email } = event.body;



    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            statusCode: 200,
            message: "Dummy portal received the messsage : The UIDAI Portal recieved images at" + new Date() + "from " + email
        })
    };
}