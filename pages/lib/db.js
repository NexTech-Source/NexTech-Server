const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { Table } = require("dynamodb-toolbox");
const { Entity } = require("dynamodb-toolbox");
const { v4: uuidv4 } = require("uuid");


const DocumentClient = new AWS.DynamoDB.DocumentClient();
const Usertable = new Table({
    name: 'users-table-new-2',
    partitionKey: "pk",
    DocumentClient: DocumentClient
});
const User = new Entity({

    name: 'User',
    attributes: {
        epk: { type: "string", partitionKey: true }, //epk to avoid clash with pk from Table
        id: { type: "string" },
        passwordHash: { type: "string" },
        createdAt: { type: "string" }
    },
    table: Usertable
})


const LogTable = new Table({
    name: 'log-table',
    partitionKey: "pk",
    DocumentClient: DocumentClient
});

const Record = new Entity({
    name: 'Record',
    attributes: {
        tid: { type: "string", partitionKey: true }, //transaction id
        email: { type: "string" },
        numberOfPages: { type: "number" },
        status: { type: "string" },
        createdAt: { type: "string" }
    },
    table: LogTable
});

const updateRecordStatus = async(tid, status) => {
    const response = await Record.update({ tid: tid, status: status });
    return Record.parse(response);
}

const putRecordtoDb = async props => {
    const { tid, email, numberOfPages, status } = props;

    const record = {
        tid: tid,
        email: email,
        numberofPages: numberOfPages,
        status: status,
        createdAt: new Date()
    };
    const response = await Record.put(record);
    return Record.parse(response);
}

const pollOnDbRecord = async tid => {
    const response = await Record.get({ tid });
    return Record.parse(response);
}

const createDbUser = async props => {
    const passwordHash = await bcrypt.hash(props.password, 8); // hash the pass
    delete props.password; // don't save it in clear text
    if ((await getUserByEmail(props.email)).passwordHash) {
        throw {
            message: "User with this email-id already exists",
            statusCode: 400
        };
    } //TODO: change this later with conditional put item expression
    const response = await User.put({
        epk: props.email,
        id: uuidv4(),
        passwordHash,
        createdAt: new Date(),
    });

    console.log("create user with params", response);
    return User.parse(response);
};

const getUserByEmail = async email => {
    const primaryKey = {
        epk: email
    }
    const response = await User.get(primaryKey);
    return User.parse(response);
};

module.exports = {
    createDbUser,
    getUserByEmail
};