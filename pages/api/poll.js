const { pollOnDbRecord, shiftRecordtoHistory } = require('../lib/db');
const { getUserFromToken } = require('../lib/utils');
module.exports.handler = async function pollJS(event) {
    const userObj = await getUserFromToken(event.headers.authToken);
    const { tid } = JSON.parse(event.body);
    const dbRecord = await pollOnDbRecord(tid);
    if (dbRecord.status == "yellow") {
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({
                base64encoded: false,
                message: "Yellow",
            })
        };
    } else {
        await shiftRecordtoHistory(tid);
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({
                base64encoded: false,
                message: dbRecord.status,
            })
        };
    }
}