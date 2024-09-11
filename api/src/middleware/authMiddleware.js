import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const decoded = jwt.verify(JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
