import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

// Helper to extract question mapping from responses
// Assuming responses is { "question_id": score_1_to_5 }
// We need to map table results to formula variables A1, E1, etc.
// FOR NOW: This implementation assumes the 'category' field in 'test_questions' 
// contains the code (e.g., 'A1', 'E6', 'N1').

export const calculateBehavioralScore = async (req: Request, res: Response) => {
    try {
        const { testId, responses } = req.body;
        const user = (req as any).user;

        if (!testId || !responses) {
            return res.status(400).json({ error: 'Missing testId or responses' });
        }

        // 1. Fetch Question categories to map responses to variables
        const { data: questions, error: qError } = await supabaseAdmin
            .from('test_questions')
            .select('id, category')
            .eq('test_id', testId);

        if (qError) throw qError;

        const variables: Record<string, number> = {};

        // Map scores to codes (A1, E1, etc)
        // Default to neutral (3) if missing but item is required by formula logic
        questions?.forEach(q => {
            if (q.category) {
                variables[q.category] = responses[q.id] || 3;
            }
        });

        // 2. Implementation of Formulas from Fórmulas.py
        // Note: The formulas use some logic like (6 - N1) which handles item inversion
        const scores: Record<string, number> = {};

        // Helper to get safe value
        const v = (code: string) => variables[code] || 3;

        // --- AMABILIDADE (AGREEABLENESS) ---
        scores['Confiança'] = (2 * v('A1') + (v('E1') + 2 * (v('E6') + v('A3')) + 2 * (6 - v('N1')) + 2 * (6 - v('A4')) + (6 - v('N4')))) / 60;
        scores['Franqueza'] = (2 * v('A2') + 2 * (v('C3') + v('A1') + v('A3')) + 2 * ((6 - v('A4')) + (6 - v('N2'))) + v('A2')) / 65;
        scores['Altruísmo'] = (2 * v('A3') + 2 * (v('A1') + v('E6') + v('A6')) + 2 * (v('N2') + v('E3')) + v('A5')) / 65;
        scores['Complacência'] = (2 * v('A4') + 2 * v('A6') + v('A1') + v('A2') + 2 * (6 - v('E3')) + 2 * (6 - v('N2')) + (6 - v('C3'))) / 55;
        scores['Modestia'] = (2 * v('A5') + 2 * (v('A6') + v('C3')) + v('A1') + 2 * (6 - v('E3')) + 2 * (6 - v('O1')) + v('N4')) / 60;
        scores['Sensibilidade'] = (2 * v('A6') + 2 * (v('A3') + v('E6')) + v('A4') + 2 * (6 - v('E3')) + 2 * (6 - v('N1')) + (6 - v('C3'))) / 60;

        // --- CONSCIENCIOSIDADE (CONSCIENTIOUSNESS) ---
        scores['Competência'] = (2 * v('C1') + 2 * v('C5') + v('E3') + v('O5') + 2 * (6 - v('N1')) + (6 - v('N6')) + (6 - v('N3'))) / 50;
        scores['Ordem'] = (2 * v('C2') + 2 * (v('C4') + v('C5')) + v('C6') + (6 - v('E5')) + (6 - v('N1')) + 2 * (6 - v('O5'))) / 55;
        scores['Senso de dever'] = (2 * v('C3') + 2 * (v('C1') + v('C5')) + v('A4') + (6 - v('O6')) + 2 * (6 - v('N6')) + 2 * (6 - v('N2'))) / 60;
        scores['Esforço por realizações'] = (2 * v('C4') + 2 * (v('C5') + v('C1')) + v('E3') + 2 * (6 - v('N6')) + 2 * (6 - v('N1')) + (6 - v('N2'))) / 60;
        scores['Autodisciplina'] = (2 * v('C5') + 2 * (v('C4') + v('E3')) + v('C1') + 2 * (6 - v('E5')) + (6 - v('N5'))) / 50;
        scores['Ponderação'] = (2 * v('C6') + 2 * (v('C5') + v('C1')) + v('C2') + 2 * (6 - v('N5')) + 2 * (6 - v('E5'))) / 55;

        // --- EXTROVERSÃO (EXTRAVERSION) ---
        scores['Acolhimento'] = (2 * v('E1') + 2 * v('E2') + v('E3') + v('E4') + (6 - v('N4')) + (6 - v('N3')) + 2 * (6 - v('N2'))) / 50;
        scores['Gregarismo'] = (2 * v('E2') + 2 * (v('E1') + v('E3')) + v('E4') + (6 - v('N3')) + (6 - v('C2')) + 2 * (6 - v('N4'))) / 55;
        scores['Assertividade'] = (2 * v('E3') + 2 * (v('C1') + v('E4') + v('C5')) + 2 * ((6 - v('N1')) + (6 - v('N6')) + (6 - v('A4')))) / 70;
        scores['Atividade'] = (2 * v('E4') + v('E2') + v('E3') + v('O4') + 2 * (6 - v('N3')) + (6 - v('N1')) + (6 - v('N6'))) / 45;
        scores['Busca de sensações'] = (2 * v('E5') + 2 * (v('E6') + v('O4') + v('O2')) + 2 * ((6 - v('C6')) + (6 - v('N1')) + (6 - v('C2')))) / 70;
        scores['Emoções Positivas'] = (2 * v('E6') + 2 * (v('E1') + v('E3')) + v('A3') + (6 - v('N1')) + 2 * (6 - v('N3')) + 2 * (6 - v('N6'))) / 60;

        // --- NEUROTICISMO (NEUROTICISM) ---
        scores['Ansiedade'] = (2 * v('N1') + 2 * (v('N3') + v('N4')) + v('C5') + 2 * ((6 - v('C1')) + (6 - v('A1')) + (6 - v('E3')))) / 65;
        scores['Raiva'] = (2 * v('N2') + 2 * (v('E3') + v('N4')) + v('N3') + 2 * (6 - v('A1')) + 2 * (6 - v('A3'))) / 55;
        scores['Depressão'] = (2 * v('N3') + 2 * (v('N1') + v('N6')) + v('O3') + 2 * (6 - v('E6')) + 2 * (6 - v('E4')) + (6 - v('C1'))) / 60;
        scores['Embaraço'] = (2 * v('N4') + 2 * (v('A5') + v('N3') + v('N1')) + 2 * (6 - v('E3')) + 2 * (6 - v('A1')) + (6 - v('E2'))) / 65;
        scores['Impulsividade'] = (2 * v('N5') + 2 * (v('E5') + v('N1')) + v('O4') + 2 * (6 - v('C5')) + 2 * (6 - v('C1')) + (6 - v('C3'))) / 60;
        scores['Vulnerabilidade'] = (2 * v('N6') + 2 * (v('N1') + v('N3')) + v('O3') + 2 * ((6 - v('C1')) + (6 - v('E3')) + (6 - v('A2')))) / 65;

        // --- ABERTURA (OPENNESS) ---
        scores['Fantasia'] = (2 * v('O1') + 2 * v('O5') + v('E5') + v('O2') + 2 * ((6 - v('C6')) + (6 - v('C5')) + (6 - v('C2')))) / 60;
        scores['Estética'] = (2 * v('O2') + 2 * v('O1') + v('O5') + v('O3') + 2 * (6 - v('C5')) + 2 * (6 - v('C2')) + (6 - v('E3'))) / 55;
        scores['Sentimentos'] = (2 * v('O3') + 2 * (v('O1') + v('N1')) + v('E6') + 2 * (6 - v('E3')) + (6 - v('C2')) + (6 - v('C5'))) / 55;
        scores['Ações Variadas'] = (2 * v('O4') + 2 * (v('O1') + v('E5')) + v('O6') + (6 - v('C6')) + 2 * (6 - v('C2')) + 2 * (6 - v('C5'))) / 60;
        scores['Ideias'] = (2 * v('O5') + 2 * (v('O1') + v('O2')) + v('O6') + 2 * (6 - v('C2')) + 2 * (6 - v('C5')) + (6 - v('N1'))) / 60;
        scores['Valores'] = (2 * v('O6') + 2 * (v('O1') + v('O5')) + v('A1') + (6 - v('C3')) + 2 * (6 - v('A4')) + 2 * (6 - v('C2'))) / 60;

        // Normalize to 0-100 and fix decimals
        const normalizedScores: Record<string, number> = {};
        Object.entries(scores).forEach(([key, val]) => {
            // Usually Big Five indexes are 0-1 or 0-100. Let's provide 0-100.
            normalizedScores[key] = Math.max(0, Math.min(100, Math.round(val * 100)));
        });

        // 3. Update database
        const { error: updateError } = await supabaseAdmin
            .from('candidate_test_results')
            .update({
                responses: responses,
                scores: normalizedScores,
                completed_at: new Date().toISOString()
            })
            .eq('test_id', testId)
            .eq('user_id', user.id);

        if (updateError) throw updateError;

        res.json({ success: true, scores: normalizedScores });
    } catch (error: any) {
        console.error('Calculation error:', error);
        res.status(500).json({ error: error.message || 'Error calculating scores' });
    }
};
