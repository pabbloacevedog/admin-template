import cluster from 'cluster';
import os from 'os';
import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { loadModules } from './middleware/loadModules.js';
import { setupGraphQL } from './middleware/graphql.js';
import { startServer } from './middleware/startServer.js';
dotenv.config();

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.info(`SETUP - Clustering to ${numCPUs} CPUs...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.warn(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Crear servidor express
    const app = express();
    const httpServer = createServer(app);

    // Configurar GraphQL
    setupGraphQL(app, httpServer);

    // Cargar módulos
    loadModules(app);

    // Manejador de errores global
    app.use((err, req, res, next) => {
        console.error('Error no capturado:', err);
        res.status(500).send('Ocurrió un error');
    });

    // Iniciar servidor
    startServer(httpServer);
}
