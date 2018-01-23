require('lib/models')()

const User = require('lib/models').User
const dbReady = require('lib/models').ready

const mapPromises = (fn) => (array) => Promise.all(array.map(fn))

exports.up = function up (done) {
  // fullname = firstName + ' ' + lastName
  dbReady()
    .then(() => User.collection
      .find({})
      .toArray()
      .then(mapPromises(function (user) {
        return User.collection.findOneAndUpdate({ _id: user._id }, {
          $set: {
            fullName: user.firstName + ' ' + user.lastName
          }
        })
      }))
    )
    .then(function (results) {
      const total = results.filter((v) => !!v).length
      console.log(`change users to full name for ${total} users succeded.`)
      done()
    })
    .catch(function (err) {
      console.log('change users to full name failed at ', err)
      done(err)
    })
  done();
};

exports.down = function down(done) {
  console.log('change users to full name has no down migration')
  done();
};
