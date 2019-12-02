'use strict'

module.exports = ({ API }) => ({ passport, jwt, services }) => {

    passport.use(new jwt.Strategy({
        jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderWithScheme(API.TOKEN.METHOD),
        secretOrKey: API.SECRET
    }, async (payload, done) => {

        const { data, error } = await services.user.findOne({ _id: payload._id })

        return (error ? done(error, false) : (data ? done(null, data) : done(null, false)))

    }))

}
