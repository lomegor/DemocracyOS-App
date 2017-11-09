/**
 * Module dependencies.
 */

var routes = require('./routes')
var strategy = require('./strategy')

/**
 * Expose AuthAuth0 Module
 */

module.exports = AuthAuth0

/**
 * AuthAuth0 Module
 */

function AuthAuth0 (app) {
  /**
   * Instantiates PassportJS midlewares
   */

  strategy(app)

  /**
   * Attach routes to parent application
   */

  app.use(routes)
}
