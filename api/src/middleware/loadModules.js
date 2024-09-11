import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import { CLIENT } from '../config/config.js';
import { languageMiddleware } from './languageMiddleware.js';
export function loadModules(app) {
    console.info('SETUP - Cargando módulos...');

    const corsOptions = {
        origin: CLIENT,
        credentials: true,
        optionsSuccessStatus: 200,
    };
    app.use(languageMiddleware);
    app.use(cors(corsOptions));
    app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(morgan('tiny'));
}
