// Mensagem de retorno de formulário (erro, sucesso ou informação), anunciada por leitores de tela.
export default function FormAlert({ type = 'info', children, id }) {
  return (
    <div id={id} className={`form-alert form-alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
