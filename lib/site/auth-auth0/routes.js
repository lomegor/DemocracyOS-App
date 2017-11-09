/**
 * Module dependencies.
 */

var config = require('lib/config')
var express = require('express')
var passport = require('passport')
var log = require('debug')('democracyos:auth:auth0:routes')
var User = require('lib/models').User
var jwt = require('lib/jwt')

/**
 * Expose auth app
 */

var app = module.exports = express()

/*
 * Auth0 Auth routes
 */

app.get('/auth/auth0',
  passport.authenticate('auth0', function (req, res) {
    return res.redirect('/')
  })
)

app.get('/auth/auth0/callback',
  passport.authenticate('auth0', { failureRedirect: '/' }),
  function (req, res) {
    // After successful authentication
    // redirect to homepage.
    log('Log in user %s', req.user.id)
    jwt.setUserOnCookie(req.user, res)
    return res.redirect('/')
  }
)
