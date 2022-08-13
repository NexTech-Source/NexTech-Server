const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const { Table, Entity }=require("dynamodb-toolbox")
const { v4: uuidv4 } = require("uuid");


const docClient = new AWS.DynamoDB.DocumentClient();
const Usertable = new Table({
  // Specify table name
  table: "users-table",

  // Define partition and sort keys
  partitionKey: "pk",
  //sortKey: "sk",

  // Define schema
  docClient
});
const User=new Entity({
  
  name:'User',
  attributes:
  {
    pk: { type: "string", alias: "email" },
    id: { type: "string" },
    passwordHash: { type: "string" },
    createdAt: { type: "string" }

  },
  table:Usertable
})


// AWS.config.update({
//     region: "eu-central-1"
//   });
  

const createDbUser = async props => {
    const passwordHash = await bcrypt.hash(props.password, 8); // hash the pass
    delete props.password; // don't save it in clear text
  
    const params = User.put({
      ...props,
      id: uuidv4(),
      passwordHash,
      createdAt: new Date()
    });
  
    console.log("create user with params", params);
  
    const response = await docClient.put(params).promise();
  
    return User.parse(response);
  };
  
  const getUserByEmail = async email => {
    const params = User.get({ email});
    const response = await docClient.get(params).promise();
  
    return User.parse(response);
  };
  
  module.exports = {
    createDbUser,
    getUserByEmail
  };