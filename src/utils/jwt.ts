import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (userId: number, email: string, roleId: number) => {
    return jwt.sign({ id: userId, email, role_id: roleId }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET);
};
