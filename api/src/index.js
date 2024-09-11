import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { loadModules } from './middleware/loadModules.js';
import { setupGraphQL } from './middleware/graphql.js';
import { startServer } from './middleware/startServer.js';

dotenv.config();

// Crear servidor express
const app = express();
const httpServer = createServer(app);

// Cargar módulos
loadModules(app);

// Configurar GraphQL
setupGraphQL(app, httpServer);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);
    res.status(500).send('Ocurrió un error');
});

// Iniciar servidor
startServer(httpServer);
