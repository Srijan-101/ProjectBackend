const JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt;

const { PrismaClient } = require('@prisma/client');
const { user } = new PrismaClient

const opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWTSECRET;

module.exports = (passport) => {
    try {
        passport.use(new JWTStrategy(opts, async function (jwt_payload, done) {
            const User = await user.findFirst({
                where: {
                    id: jwt_payload.id
                }
            })
            if (User) {
                return done(null, User);
            } else {
                return done(null, false)
            }
        }))
    } catch (error) {
        console.log(error);
    }
}