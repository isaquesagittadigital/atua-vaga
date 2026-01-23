
import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { isValidCPF, isValidPassword } from '../utils/validators';

export const validateRegistration = async (req: Request, res: Response) => {
    const { cpf, password } = req.body;
    const errors: any = {};

    if (cpf && !isValidCPF(cpf)) {
        errors.cpf = 'CPF inválido';
    }

    if (password && !isValidPassword(password)) {
        errors.password = 'A senha deve conter pelo menos 6 caracteres, uma letra, um número e um caractere especial.';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    res.json({ valid: true });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name, phone, cpf, role } = req.body;

        // Backend Validation (Strict)
        if (!isValidCPF(cpf)) {
            return res.status(400).json({ error: 'CPF inválido' });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: 'Senha fraca. Necessário: 6 chars, letra, número, especial.' });
        }

        // Check if user already exists (optional, Supabase handles this but we can customize msg)
        // For now, let Supabase handle the unique email error.

        // Create user in Supabase Auth via Admin Client
        const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm since we are creating via backend
            user_metadata: {
                name,
                phone,
                cpf, // Store CPF in metadata
                role: role || 'candidate'
            }
        });

        if (authError) throw authError;

        // We can optionally create the profile record here if the Trigger doesn't catch it for some reason,
        // but our Trigger existing in DB should handle it.

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Use Supabase Client to sign in (NOT Admin, just verify credentials)
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        res.json({ session: data.session, user: data.user });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Credenciais inválidas' });
    }
};
