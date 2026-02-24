const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedBigFiveQuestions() {
    console.log('Iniciando inclusão de perguntas Big Five...');

    // 1. Criar ou obter o Teste Big Five Principal
    const { data: test, error: testError } = await supabase
        .from('behavioral_tests')
        .upsert({
            id: '550e8400-e29b-41d4-a716-446655440000', // UUID fixo para referência
            title: 'Mapeamento de Perfil Comportamental (Big Five)',
            description: 'Avaliação psicométrica completa baseada nos 5 grandes fatores de personalidade.',
            file_size: '250 KB'
        })
        .select()
        .single();

    if (testError) {
        console.error('Erro ao criar teste:', testError);
        return;
    }

    const testId = test.id;
    console.log(`Teste ID: ${testId}`);

    // 2. Definir perguntas mapeadas para os códigos do Fórmulas.py
    // Selecionei uma pergunta representativa para cada uma das principais facetas citadas no arquivo py
    const questions = [
        // AMABILIDADE (A)
        { test_id: testId, category: 'A1', question_text: 'Acredito que as pessoas têm boas intenções e são honestas.', order_index: 1 },
        { test_id: testId, category: 'A2', question_text: 'Costumo ser direto e verdadeiro em minhas opiniões, mesmo que desconfortáveis.', order_index: 2 },
        { test_id: testId, category: 'A3', question_text: 'Sinto prazer em ajudar os outros e me envolver em causas sociais.', order_index: 3 },
        { test_id: testId, category: 'A4', question_text: 'Evito conflitos e costumo ceder para manter a harmonia no grupo.', order_index: 4 },
        { test_id: testId, category: 'A5', question_text: 'Não gosto de chamar atenção para minhas conquistas; sou uma pessoa modesta.', order_index: 5 },
        { test_id: testId, category: 'A6', question_text: 'Me sensibilizo facilmente com os problemas e sofrimentos alheios.', order_index: 6 },

        // CONSCIENCIOSIDADE (C)
        { test_id: testId, category: 'C1', question_text: 'Me considero uma pessoa muito competente e capaz de realizar minhas tarefas.', order_index: 7 },
        { test_id: testId, category: 'C2', question_text: 'Mantenho meus pertences e meu ambiente de trabalho sempre organizados.', order_index: 8 },
        { test_id: testId, category: 'C3', question_text: 'Sinto que é meu dever cumprir rigorosamente com todas as minhas obrigações.', order_index: 9 },
        { test_id: testId, category: 'C4', question_text: 'Trabalho duro para atingir meus objetivos e sou ambicioso(a).', order_index: 10 },
        { test_id: testId, category: 'C5', question_text: 'Tenho autodisciplina para começar e terminar projetos no prazo.', order_index: 11 },
        { test_id: testId, category: 'C6', question_text: 'Penso muito bem antes de tomar qualquer decisão importante.', order_index: 12 },

        // EXTROVERSÃO (E)
        { test_id: testId, category: 'E1', question_text: 'Gosto de estar perto de pessoas e me sinto acolhido em grupos.', order_index: 13 },
        { test_id: testId, category: 'E2', question_text: 'Prefiro trabalhar em equipe do que sozinho(a).', order_index: 14 },
        { test_id: testId, category: 'E3', question_text: 'Tomo a liderança em conversas e costumo ser assertivo(a).', order_index: 15 },
        { test_id: testId, category: 'E4', question_text: 'Levo uma vida ativa e estou sempre em movimento.', order_index: 16 },
        { test_id: testId, category: 'E5', question_text: 'Gosto de situações emocionantes e de correr riscos calculados.', order_index: 17 },
        { test_id: testId, category: 'E6', question_text: 'Sou uma pessoa alegre e que costuma ver o lado positivo das situações.', order_index: 18 },

        // NEUROTICISMO (N)
        { test_id: testId, category: 'N1', question_text: 'Frequentemente me sinto ansioso(a) ou preocupado(a) com o futuro.', order_index: 19 },
        { test_id: testId, category: 'N2', question_text: 'Às vezes perco a paciência e sinto raiva com facilidade.', order_index: 20 },
        { test_id: testId, category: 'N3', question_text: 'Às vezes me sinto desanimado(a) ou triste sem um motivo aparente.', order_index: 21 },
        { test_id: testId, category: 'N4', question_text: 'Me sinto envergonhado(a) ou fico "sem graça" em situações sociais novas.', order_index: 22 },
        { test_id: testId, category: 'N5', question_text: 'Tenho dificuldade em resistir a impulsos ou desejos imediatos.', order_index: 23 },
        { test_id: testId, category: 'N6', question_text: 'Me sinto vulnerável ou incapaz de lidar com situações de grande pressão.', order_index: 24 },

        // ABERTURA (O)
        { test_id: testId, category: 'O1', question_text: 'Tenho uma imaginação fértil e gosto de fantasiar sobre o futuro.', order_index: 25 },
        { test_id: testId, category: 'O2', question_text: 'Aprecio artes, música e experiências estéticas variadas.', order_index: 26 },
        { test_id: testId, category: 'O3', question_text: 'Dou muita importância aos meus sentimentos e emoções internas.', order_index: 27 },
        { test_id: testId, category: 'O4', question_text: 'Gosto de experimentar coisas novas e variar minha rotina.', order_index: 28 },
        { test_id: testId, category: 'O5', question_text: 'Gosto de debater ideias teóricas e conceitos abstratos.', order_index: 29 },
        { test_id: testId, category: 'O6', question_text: 'Costumo questionar valores tradicionais e prefiro formar minha própria moral.', order_index: 30 }
    ];

    // 3. Limpar perguntas antigas deste teste para evitar duplicidade (opcional/seguro)
    await supabase.from('test_questions').delete().eq('test_id', testId);

    // 4. Inserir novas perguntas
    const { error: insertError } = await supabase
        .from('test_questions')
        .insert(questions);

    if (insertError) {
        console.error('Erro ao inserir perguntas:', insertError);
    } else {
        console.log('30 perguntas Big Five inseridas com sucesso!');
    }
}

seedBigFiveQuestions();
