var ip = require('ip')

var config = module.exports = {
  testPort: 60111,
  port: process.env.GITSPY_PORT || 60110,
  owner: process.env.GITSPY_OWNER || 'vigour-io',
  gitUsername: process.env.GITSPY_USERNAME,
  gitPassword: process.env.GITSPY_PASSWORD
}

var myIP = ip.address()
config.callbackURL = `http://${myIP}:${config.port}/push`
