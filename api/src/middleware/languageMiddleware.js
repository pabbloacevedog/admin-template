// src/middleware/languageMiddleware.js
import { AsyncLocalStorage } from 'async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage();

export const languageMiddleware = (req, res, next) => {
    const store = new Map();
    store.set('lang', req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : 'en');
    asyncLocalStorage.run(store, () => {
        next();
    });
};
