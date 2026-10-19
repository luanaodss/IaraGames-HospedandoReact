// Traduz os erros do Supabase Auth para mensagens compreensíveis.
export function authErrorMessage(error) {
  if (!error) return '';
  const code = error.code || '';
  const message = (error.message || '').toLowerCase();

  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Seu e-mail ainda não foi confirmado. Abra o link enviado para sua caixa de entrada e tente de novo.';
  }
  if (code === 'user_already_exists' || code === 'email_exists' || message.includes('already registered')) {
    return 'Este e-mail já está cadastrado. Entre com sua senha ou use outro e-mail.';
  }
  if (code === 'weak_password' || message.includes('password should')) {
    return 'A senha é fraca demais. Use pelo menos 8 caracteres, com letras e números.';
  }
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || error.status === 429) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.';
  }
  if (code === 'email_address_invalid' || message.includes('invalid format') || message.includes('is invalid')) {
    return 'Este endereço de e-mail não é aceito. Confira se foi digitado corretamente.';
  }
  if (code === 'signup_disabled') return 'O cadastro de novos usuários está desativado no momento.';
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  }
  return 'Não foi possível concluir a operação. Tente novamente em instantes.';
}
