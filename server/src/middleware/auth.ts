import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');

        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach user to request object
        (req as any).user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
