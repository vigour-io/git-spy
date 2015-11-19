var Config = module.exports = {
	port: process.env.GITSPY_PORT,
	owner: process.env.GITSPY_OWNER || 'vigour-io',
	apiToken: process.env.GITSPY_API_TOKEN,
	callbackURL: process.env.GITSPY_CALLBACK_URL
}