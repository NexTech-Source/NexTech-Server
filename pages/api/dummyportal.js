module.exports.handler = async function dummyportal(event) {
    //TODO: add event check later 
    console.log("Event for dummy portal :" + JSON.stringify(event));
    return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ statusCode: 200, message: "Dummy portal received the messsage" })
    };
}