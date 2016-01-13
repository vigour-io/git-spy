var ip = require('ip')

var config = module.exports = {
  testPort: 60111,
  port: process.env.GITSPY_PORT,
  owner: process.env.GITSPY_OWNER || 'vigour-io',
  apiToken: process.env.GITSPY_API_TOKEN
}

var myIP = ip.address()
config.callbackURL = `http://${myIP}:${config.port}/push`
