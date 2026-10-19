// Consulta de endereço pela API pública ViaCEP: https://viacep.com.br/ws/{CEP}/json/

export function normalizeCep(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 8);
}

export function formatCep(value) {
  const digits = normalizeCep(value);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export class CepError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * Busca um CEP no ViaCEP.
 * Lança CepError com code: 'vazio' | 'incompleto' | 'nao-encontrado' | 'conexao' | 'resposta-invalida'.
 */
export async function fetchCep(value, { signal } = {}) {
  const cep = normalizeCep(value);
  if (!cep) throw new CepError('vazio', 'Informe o CEP para buscar o endereço.');
  if (cep.length !== 8) throw new CepError('incompleto', 'O CEP precisa ter 8 dígitos.');

  let response;
  try {
    response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new CepError('conexao', 'Não foi possível consultar o CEP agora. Verifique sua conexão ou preencha o endereço manualmente.');
  }

  if (!response.ok) {
    // O ViaCEP responde 400 para formato inválido.
    throw new CepError(
      response.status === 400 ? 'incompleto' : 'conexao',
      response.status === 400
        ? 'CEP em formato inválido.'
        : 'O serviço de CEP está indisponível no momento. Preencha o endereço manualmente.'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new CepError('resposta-invalida', 'O serviço de CEP retornou uma resposta inesperada. Preencha o endereço manualmente.');
  }

  if (data?.erro === true || data?.erro === 'true') {
    throw new CepError('nao-encontrado', 'CEP não encontrado. Confira os números ou preencha o endereço manualmente.');
  }
  if (typeof data !== 'object' || typeof data.localidade !== 'string' || typeof data.uf !== 'string') {
    throw new CepError('resposta-invalida', 'O serviço de CEP retornou uma resposta inesperada. Preencha o endereço manualmente.');
  }

  return {
    cep: normalizeCep(data.cep || cep),
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    estado: data.uf || '',
  };
}
