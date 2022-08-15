module.exports.handler = async function dummyportal(event) {
    //TODO: add event check later 
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: "Dummy portal received the messsage" })
    };
}