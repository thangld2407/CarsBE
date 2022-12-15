module.exports = {
	apps: [
		{
			name: 'API Cars',
			script: './app.js',
			instances: '2',
			exec_mode: 'cluster'
		}
	]
};
