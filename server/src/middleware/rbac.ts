
import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).profile; // Attached by requireAuth -> fetchProfile

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No user profile found' });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
