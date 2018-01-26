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
    callbackURL: callbackURL,
    scope: 'profile email'
  }, function (accessToken, refreshToken, profile, done) {
    var email = profile._json.email
    User.findByEmail(email, function (err, userWithEmail) {
      if (err) return done(err)

      if (userWithEmail) {
        assignProfile(userWithEmail, profile, accessToken, done)
      } else {
        assignProfile(new User(), profile, accessToken, done)
      }
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
      if (profile._json.family_name) {
        user.set('fullName', profile._json.given_name + ' ' + profile._json.family_name)
      } else {
        user.set('fullName', profile._json.given_name)
      }
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
