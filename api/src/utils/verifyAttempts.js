import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';

// Configuración de Redis y Rate Limiters
const redisClient = new Redis({
    enableOfflineQueue: false,
    host: process.env.REDIS_HOST, // configura tu host de Redis si es necesario
    port: process.env.REDIS_PORT, // configura tu puerto de Redis si es necesario
});

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Bloquear por 1 día si se alcanzan 100 intentos fallidos por día
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90, // Guardar el número durante 90 días desde el primer fallo
    blockDuration: 60 * 60, // Bloquear por 1 hora
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

// Función para verificar intentos fallidos
export const verifyAttempts = async (username, ipAddr, res) => {
    const usernameIPkey = getUsernameIPkey(username, ipAddr);

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
        limiterSlowBruteByIP.get(ipAddr),
    ]);

    let retrySecs = 0;

    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        throwCustomError(ErrorTypes.TOO_MANY_REQUESTS);
    }
};

// Función para registrar un intento fallido
export const recordFailedAttempt = async (username, ipAddr) => {
    const usernameIPkey = getUsernameIPkey(username, ipAddr);

    const promises = [limiterSlowBruteByIP.consume(ipAddr)];
    if (username) {
        promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
    }

    await Promise.all(promises);
};

// Función para reiniciar los intentos fallidos después de un login exitoso
export const resetFailedAttempts = async (username, ipAddr) => {
    const usernameIPkey = getUsernameIPkey(username, ipAddr);
    await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
};
