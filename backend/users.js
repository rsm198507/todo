const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const errors = require('../errors');

// this will be our data base's data structure
const userSchema = new Schema(
    {
        name: String,
        mail: String,
        password: String
    }
);


const User = mongoose.model('user', userSchema);

// User.kek = () => {
//     console.log('here')
// }

User.authenticate = async (mail, password) => {
    // const user = await User.findOne({
    //     mail: mail
    // });
    // if (!user) throw errors.NotFoundError('User not found!');
    // if (!user.password) throw errors.NotAllowedError('Password not set! Please contact support.');
    // if (!user.isActive) throw errors.NotAllowedError('Your account has ben disabled, please contact support.');
    // if (user.password !== User.hashPassword(password)) throw errors.UnauthorizedError('Invalid credentials');
    // console.log(user)
    // return user;
};

/**
 * @param {string} password
 * @return {any} hash
 */
userSchema.hashPassword = (password) => {
    return crypto
        .createHmac('sha512', process.env.SALT || 'salt')
        .update(password)
        .digest('hex');
};

/**
 * Generate Authentication Token for user
 * @return {{type: string, expiresIn: *, accessToken: *}}
 */
// userSchema.prototype.generateToken = async function () {
//     const salt = process.env.SALT || 'salt';
//     const data = {
//         userId: this.uuid,
//         userRole: this.userRole,
//     };
//
//     const tokenLifeTime = process.env.TOKEN_LIFE_TIME || 600000;
//     return {
//         type: 'Bearer',
//         expiresIn: tokenLifeTime,
//         accessToken: jwt.sign(data, salt, {expiresIn: tokenLifeTime}),
//     };
// };




// Export the model
module.exports = User;
