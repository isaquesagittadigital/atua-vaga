
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
        const { email, password, name, phone, cpf, role, companyName, document } = req.body;
        const userRole = role || 'candidate';

        // Backend Validation (Strict)
        if (userRole === 'candidate' && !isValidCPF(cpf)) {
            return res.status(400).json({ error: 'CPF inválido' });
        }
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: 'Senha fraca. Necessário: 6 chars, letra, número, especial.' });
        }

        // 1. Manual Check for CPF existence
        if (userRole === 'candidate' && cpf) {
            const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
            if (!searchError && existingUsers && existingUsers.users) {
                const duplicate = existingUsers.users.find((u: any) => u.user_metadata?.cpf === cpf);
                if (duplicate) {
                    return res.status(409).json({ error: 'CPF already exists' });
                }
            }
        }

        // Create user in Supabase Auth via Admin Client
        // Ensure metadata is passed so the Trigger can populate the profile!
        const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: name,         // Standard metadata
                full_name: name,    // Common variant
                phone: phone,
                cpf: cpf,
                role: userRole
            }
        });

        if (authError) {
            if (authError.message.includes("already has been registered") || authError.status === 422) {
                return res.status(409).json({ error: 'User already registered' });
            }
            throw authError; // Re-throw other errors
        }

        if (!user.user) throw new Error("User creation failed");

        const userId = user.user.id;

        // 2. Profile Creation Logic -> REMOVED
        // We rely on the Supabase Trigger to create the profile.
        // If we try to insert/upsert, we get Duplicate Key or RLS errors.

        // Context: Company Registration
        if (userRole === 'company_admin') {
            if (!companyName || !document) {
                // Rollback
                await supabaseAdmin.auth.admin.deleteUser(userId);
                return res.status(400).json({ error: 'Company Name and Document are required for company registration' });
            }

            // Create Company
            const { data: company, error: companyError } = await supabaseAdmin
                .from('companies')
                .insert({
                    name: companyName,
                    document: document // CNPJ
                })
                .select()
                .single();

            if (companyError) {
                // Rollback
                await supabaseAdmin.auth.admin.deleteUser(userId);
                if (companyError.code === '23505') {
                    return res.status(409).json({ error: 'Company document (CNPJ) already registered' });
                }
                throw companyError;
            }

            // Link User to Company
            // Note: This relies on 'profiles' row existing. 
            // If the trigger implies a delay, we might fail here if Foreign Key constraint checks immediately 
            // and the row isn't committed yet. 
            // Supabase Triggers usually run in the same transaction for 'AFTER INSERT', so it should be fine.
            const { error: memberError } = await supabaseAdmin
                .from('company_members')
                .insert({
                    company_id: company.id,
                    user_id: userId,
                    role: 'company_admin'
                });

            if (memberError) {
                // If this fails (e.g. profile doesn't exist yet?), we definitely have a trigger issue.
                throw memberError;
            }
        }

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

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
