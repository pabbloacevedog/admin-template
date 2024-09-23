import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { CLIENT } from '../config/config.js';
import { languageMiddleware } from './languageMiddleware.js';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
export function loadModules(app) {
    console.info('SETUP - Cargando módulos...');

    // graphqlUploadExpress debe estar antes de bodyParser
    // app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    const corsOptions = {
        origin: CLIENT,
        credentials: true,
        optionsSuccessStatus: 200,
    };
    const uploadDir = path.join(process.cwd(), 'public');

    // Verifica si la carpeta existe, si no, la crea
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true }); // Crea la carpeta de manera recursiva si no existe
    }
    app.use(express.static('public'));
    app.use(languageMiddleware);
    app.use(cors(corsOptions));
    app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));

    // Evita aplicar bodyParser en las rutas de GraphQL
    app.use(bodyParser.json({ limit: '10mb', type: 'application/json' }));
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cookieParser());
    app.use(morgan('tiny'));
}
