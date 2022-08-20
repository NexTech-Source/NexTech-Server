const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail } = require("../lib/db");
var fs = require('fs');
async function signToken(user) {


    var cert_priv = fs.readFileSync(process.cwd() + '/jwtES256.key');
    //const cert_priv = process.env.JWT_PRIV_KEY;
    const secret = Buffer.from(process.env.JWT_SECRET, "base64");
    return await jwt.sign({ email: user.email, id: user.id, }, secret, {
        //algorithm: 'ES256', // generates error if algorithm is switched -> "Error: error:0909006C:PEM routines:get_name:no start line"
        expiresIn: 86400 // expires in 24 hours
    });
}

async function getUserFromToken(token) {
    //var cert_pub = fs.readFileSync(process.cwd() + '/jwtES256.pub.key');
    const secret = Buffer.from(process.env.JWT_SECRET, "base64");
    //const cert_pub = process.env.JWT_PUB_KEY;
    const decoded = jwt.verify(token.replace("Bearer ", ""), secret);
    return decoded;
}

async function login(args) {
    try {
        const user = await getUserByEmail(args.email);
        if (!user.passwordHash) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;

        }
        const isValidPassword = await comparePassword(
            args.password,
            user.passwordHash
        );


        if (isValidPassword) {
            const token = await signToken(user);
            return Promise.resolve({ auth: true, token: token, status: "SUCCESS" });
        } else {
            const error = new Error("Password is incorrect");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        const error = new Error(err);
        error.statusCode = err.statusCode || 500;
        return Promise.reject(error);
    }
}

function comparePassword(eventPassword, userPassword) {
    return bcrypt.compare(eventPassword, userPassword);
}

module.exports = {
    signToken,
    getUserFromToken,
    login
};