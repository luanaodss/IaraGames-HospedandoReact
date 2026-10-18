const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPrice = (value) => currency.format(value);

// Remove acentos e padroniza para minúsculas: "Araní" e "arani" passam a coincidir.
export const normalize = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
