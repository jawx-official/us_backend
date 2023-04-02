/**
 * General app configuration
 * @category Configurations
 */
class App {
	/**
	 * Name of the app
	 * @param {string} appName
	 */
	public static appName = 'Urbanspaces'

	/**
	 * The port to run the application
	 * @param {number} port
	 */
	public static port = parseInt(process.env.PORT || '3200')

	/**
	 * The environment of the current running context
	 * @param {string} env
	 */
	public static env = process.env.NODE_ENV || 'development'

	public static url = process.env.APP_URL || 'http://localhost:3200/'

	/**
	 * Maximum size of the client upload
	 * @param {string} clientBodyLimit
	 */
	static clientBodyLimit = '50mb'
}

export default App
