var config = require('lib/config')
var passport = require('passport')
var Auth0Strategy = require('passport-auth0').Strategy
var User = require('lib/models').User
var utils = require('lib/utils')

/**
 * Register Auth0 Strategy
 */

module.exports = function () {
  const callbackURL = utils.buildUrl(config, {
    pathname: '/auth/auth0/callback'
  })

  const strategy = new Auth0Strategy({
    domain: config.auth.auth0.domain,
    clientID: config.auth.auth0.clientID,
    clientSecret: config.auth.auth0.clientSecret,
    callbackURL: callbackURL
  }, function (accessToken, refreshToken, profile, done) {
    User.findByProvider(profile, function (err, user) {
      if (err) return done(err)

      var email = profile._json.email

      if (!user) {
        if (email) {
          User.findByEmail(email, function (err, userWithEmail) {
            if (err) return done(err)

            if (userWithEmail) {
              assignProfile(userWithEmail, profile, accessToken, done)
            } else {
              assignProfile(new User(), profile, accessToken, done)
            }
          })
        } else {
          assignProfile(new User(), profile, accessToken, done)
        }

        return
      }

      if (user.email !== email) {
        user.set('email', email)
        user.set('profiles.auth0.email', email)
      }

      if (user.profiles.auth0.deauthorized) {
        user.set('profiles.auth0.deauthorized')
      }

      user.isModified() ? user.save(done) : done(null, user)
    })
  })

  passport.use(strategy)
}

/**
 * Auth0 Registration
 *
 * @param {Object} profile PassportJS's profile
 * @param {Function} fn Callback accepting `err` and `user`
 * @api public
 */

function assignProfile (user, profile, accessToken, fn) {
  try {
    user.set('profiles.auth0', profile._json)
    user.set('emailValidated', true)
    user.set('profilePictureUrl', profile._json.picture)

    if (profile._json.given_name) {
      user.set('firstName', profile._json.given_name)
    }

    if (profile._json.family_name) {
      user.set('lastName', profile._json.family_name)
    }

    if (profile._json.email) {
      user.set('email', profile._json.email)
    }

    user.save(fn)
  } catch (err) {
    console.error(err)
    return fn(new Error('Couldn\'t signup with auth0.'), user)
  }
}
