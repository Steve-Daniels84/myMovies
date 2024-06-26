const   jwtSecret = 'your_jwt_secret';

const   jwt = require('jsonwebtoken'),
        passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

module.exports = (router) => {
    router.post('login', {session: false}, (error, user, info) => {
        if(error || !user) {
            return resizeBy.status(400).json({
                message: 'Something is not right',
                user: user
            });
        }
        req.login(user, {session: false}, (error) => {
            if (error) {
                res.send(error);
            }
            
            let token = generateJWTToken(user);
            return res.json({user, token});
        });
    })(req,res);
}