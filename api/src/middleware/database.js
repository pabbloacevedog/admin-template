// Imports
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize'

// App Imports
dotenv.config()

import { DB_HOST, DB_USER, DB_PASS, DB_NAME } from '../config/config.js';
console.log(DB_HOST, '192.168.50.115')
// Load database config
const config = {
	host: DB_HOST,
	dialect: 'mysql',
	// logging: process.env.ENV === 'production' ? false : console.log,
	freezeTableName: true,
	dialectOptions: {
		charset: 'utf8',
	}
}
// Create new database connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, config);
// Test connection
console.info('SETUP - Conectando Base de datos...')

sequelize.authenticate()
	.then(() => console.log('Base de datos conectada.'))
	.catch(err => {
		console.error('Error al conectar con la base de datos:', err);
		process.exit(1); // Sale del proceso en caso de error de conexión
	});

process.on('SIGINT', () => {
	sequelize.close().then(() => {
		console.log('Conexión a la base de datos cerrada.');
		process.exit(0);
	});
});


export default sequelize
