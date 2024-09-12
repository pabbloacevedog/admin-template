import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verificamos el token
        req.user = decoded; // Guardamos la información del usuario en el objeto `req`
        next(); // Pasamos al siguiente middleware
    } catch (err) {
        return res.status(401).json({ message: 'Token expired or invalid. Please log in again.' });
    }
};

export default authMiddleware;
