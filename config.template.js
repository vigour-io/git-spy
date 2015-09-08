var config = module.exports = {
  port: 60111,
  testPort: 60112,
  gitHub:{
    hostName: "api.github.com",
    version: "3.0.0",
    debug: true,
    protocol: "https",
    timeout: 5000
  },
  organization:{
    login: "vigour-io"
  },
  user:{
    userName: "<github-username>",
    token: "<github-token>"
  },
  hooks:{
    callbackUrl: 'http://igor.vigour.io:60111'
  }
};