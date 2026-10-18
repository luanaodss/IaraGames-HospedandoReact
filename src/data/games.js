// Dados extraídos das páginas originais (index.html / index-visitante.html).
// Preços, estúdios, avaliações e categorias foram mantidos conforme o protótipo.
import cardLendas from '../assets/images/card-lendas.jpg';
import cardSamsara from '../assets/images/card-samsara.jpg';
import cardTropicalia from '../assets/images/card-tropicalia.jpg';
import cardTupi from '../assets/images/card-tupi.jpg';
import cardArani from '../assets/images/card-arani.jpeg';
import cardYaguarate from '../assets/images/yaguarate-card.jpg';
import bannerArani from '../assets/images/banner-arani.jpg';
import bannerLendas from '../assets/images/banner-lendas.png';
import bannerTupi from '../assets/images/banner-tupi.png';
import logoCururu from '../assets/images/jogo-cururu.svg';
import logoDandara from '../assets/images/jogo-dandara.svg';
import logoEntreEstrelas from '../assets/images/jogo-entreasestrelas.svg';
import videoCururu from '../../trailer-cururu.mp4';
import videoDandara from '../../trailer-dandara.mp4';
import videoEntreEstrelas from '../../trailer-entreestrelas.mp4';

// Jogos do catálogo
export const games = [
  {
    id: 'yaguarate',
    name: 'Yaguaraté',
    studio: 'Mito Games',
    image: cardYaguarate,
    rating: 4.8,
    categories: ['Aventura', 'Ação', 'Indie'],
    oldPrice: 46.99,
    price: 18.79,
  },
  {
    id: 'tropicalia',
    name: 'Tropicalia',
    studio: 'Mito Games',
    image: cardTropicalia,
    rating: 4.8,
    categories: ['Aventura', 'Puzzle', 'Indie'],
    oldPrice: 46.99,
    price: 18.79,
  },
  {
    id: 'tupi',
    name: 'Tupi: The Legend of Arariboia',
    studio: 'Mito Games',
    image: cardTupi,
    rating: 4.8,
    categories: ['Aventura', 'Ação', 'Indie'],
    tagline: 'Combata a escuridão da floresta',
    oldPrice: 64.99,
    price: 38.99,
  },
  {
    id: 'lendas',
    name: 'Lendas',
    studio: 'Mito Games',
    image: cardLendas,
    rating: 4.8,
    categories: ['Aventura', 'Ritmo', 'Indie'],
    tagline: 'Mergulhe em um mundo de ritmo',
    oldPrice: 89.99,
    price: 48.99,
  },
  {
    id: 'swamp-up',
    name: 'Swamp Up',
    studio: 'Mito Games',
    image: cardSamsara,
    rating: 4.8,
    categories: ['Aventura', 'Indie', 'Plataforma'],
    oldPrice: 46.99,
    price: 18.79,
  },
  {
    id: 'arani',
    name: 'Araní',
    studio: 'Mito Games',
    image: cardArani,
    rating: 4.8,
    categories: ['Aventura', 'Ação', 'Indie'],
    tagline: 'Uma jornada pelo tempo',
    oldPrice: 46.99,
    price: 18.79,
  },
];

export const getGame = (id) => games.find((game) => game.id === id);

// Categorias geradas a partir dos dados: nenhum filtro exibido resulta sempre em lista vazia.
export const categories = [
  'Todos',
  ...Array.from(new Set(games.flatMap((game) => game.categories))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  ),
];

// Seções da Home (mesmos jogos e ordem do HTML original)
export const recommendedIds = ['yaguarate', 'tropicalia', 'tupi', 'lendas'];
export const topRatedIds = ['yaguarate', 'tropicalia', 'tupi', 'lendas'];

export const topThree = [
  { gameId: 'arani', banner: bannerArani, overlay: '', subtitle: 'UMA JORNADA PELO TEMPO' },
  { gameId: 'lendas', banner: bannerLendas, overlay: 'purple', subtitle: 'MERGULHE EM UM MUNDO DE RITMO' },
  { gameId: 'tupi', banner: bannerTupi, overlay: 'blue', subtitle: 'COMBATA A ESCURIDÃO DA FLORESTA' },
];

// "Continue jogando" (Home logada). Mantido exatamente como no protótipo.
export const continuePlaying = [
  { id: 'c-lendas', name: 'Lendas', studio: 'Mito Games', image: cardLendas, progress: 50 },
  { id: 'c-samsara', name: 'Adventure Of Samsara', studio: 'Hero Games', image: cardSamsara, progress: 65 },
  { id: 'c-yaguarate', name: 'Yaguaraté', studio: 'Febatis Studio', image: cardYaguarate, progress: 75 },
  { id: 'c-tupi', name: 'Tupi', alt: 'Tupi: The Legend of Arariboia', studio: 'Mito Games', image: cardTupi, progress: 30, extra: true },
];

// Destaques do hero (vídeos na raiz do repositório, importados pelo Vite)
export const heroSlides = [
  {
    id: 'entre-as-estrelas',
    video: videoEntreEstrelas,
    logo: logoEntreEstrelas,
    name: 'Entre as Estrelas',
    description:
      'Entre as Estrelas é um RPG leve e narrativo que acompanha duas irmãs indígenas brasileiras em uma jornada emocionante para se reencontrarem após um evento trágico que remodela sua terra natal.',
    status: 'DISPONÍVEL EM BREVE',
  },
  {
    id: 'dandara',
    video: videoDandara,
    logo: logoDandara,
    name: 'Dandara',
    description:
      'Em um universo bizarro onde os oprimidos estão à beira do esquecimento, Dandara despertou para remodelar o mundo.',
    status: 'DISPONÍVEL EM BREVE',
  },
  {
    id: 'cururu',
    video: videoCururu,
    logo: logoCururu,
    name: 'Cururu — Whispers of the Forest',
    description:
      'Em um Brasil Naturepunk, siga a jornada de Cururu, um jovem sapo que, com o poder das águas sagradas, busca purificar os biomas e explorar o folclore brasileiro em sua missão de cura e redenção.',
    status: 'DISPONÍVEL EM BREVE',
  },
];

// Painel de busca do header
export const defaultRecentSearches = ['Tropicalia', 'Lendas'];
export const searchSuggestions = ['tupi', 'arani', 'swamp-up'];
