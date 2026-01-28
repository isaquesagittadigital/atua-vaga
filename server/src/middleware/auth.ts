import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch Profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error("Error fetching profile", profileError);
            // Allow proceed but without profile? Or strict? Strict is safer.
            // return res.status(401).json({ error: 'Profile not found' });
        }

        let companyMember = null;
        if (profile?.role === 'company_admin' || profile?.role === 'company_user') {
            const { data: member } = await supabaseAdmin
                .from('company_members')
                .select('*, companies(*)')
                .eq('user_id', user.id)
                .single();
            companyMember = member;
        }

        (req as any).user = user;
        (req as any).profile = profile;
        (req as any).company = companyMember?.companies;
        (req as any).companyRole = companyMember?.role;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
