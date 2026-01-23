
// Native fetch is available in Node.js 18+

async function testAuth() {
    const API_URL = 'http://localhost:3001/api/auth';

    console.log('--- Iniciando Validação de Segurança (Backend) ---\n');

    // 1. Teste de Dados Inválidos (Deve Falhar)
    console.log('TESTE 1: Enviando dados INVÁLIDOS (CPF fake, Senha fraca)...');
    try {
        const resInvalid = await fetch(`${API_URL}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: '11111111111', password: '123' })
        });
        const dataInvalid = await resInvalid.json();

        if (resInvalid.status === 400 && dataInvalid.errors) {
            console.log('✅ SUCESSO: Backend rejeitou dados inválidos corretamente.');
            console.log('   Erros retornados:', JSON.stringify(dataInvalid.errors));
        } else {
            console.log('❌ FALHA: Backend deveria ter rejeitado, mas aceitou ou retornou erro inesperado.', dataInvalid);
        }
    } catch (e) {
        console.log('❌ ERRO TÉCNICO:', e.message);
    }

    console.log('\n------------------------------------------------\n');

    // 2. Teste de Dados Válidos (Deve Passar)
    // Usando um CPF gerado válido para teste (não existe pessoa real) e senha forte
    console.log('TESTE 2: Enviando dados VÁLIDOS...');
    try {
        // CPF gerado válido para teste
        const validCpf = '52998224725';
        const validPass = 'StrongPass1@';

        const resValid = await fetch(`${API_URL}/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: validCpf, password: validPass })
        });
        const dataValid = await resValid.json();

        if (resValid.status === 200 && dataValid.valid === true) {
            console.log('✅ SUCESSO: Backend aprovou dados válidos.');
        } else {
            console.log('❌ FALHA: Backend rejeitou dados que deveriam ser válidos.', dataValid);
        }
    } catch (e) {
        console.log('❌ ERRO TÉCNICO:', e.message);
    }
}

testAuth();
