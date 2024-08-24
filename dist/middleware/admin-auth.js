"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
// Middleware to extract and verify token
const authGuard = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const escapedRoutes = ['/auth/forgot', '/auth/login', '/auth/reset', '/auth/verify'];
        if (escapedRoutes.includes(req.path))
            return next();
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        req.user = decoded; // Attach user info to request object
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.authGuard = authGuard;
// Middleware to check user role
const roleGuard = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;
        if (!requiredRole.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=admin-auth.js.map