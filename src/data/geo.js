// Geolocalização do navegador e conversão reversa de coordenadas (Nominatim/OpenStreetMap).

export class GeoError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/** Pede a posição ao navegador. Só deve ser chamado a partir de um clique do usuário. */
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new GeoError('indisponivel', 'Seu navegador não oferece geolocalização. Preencha o endereço pelo CEP.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      (error) => {
        const messages = {
          1: 'Permissão de localização negada. Sem problema: continue preenchendo o endereço pelo CEP.',
          2: 'Não foi possível determinar sua localização. Preencha o endereço pelo CEP.',
          3: 'A localização demorou demais para responder. Tente novamente ou use o CEP.',
        };
        const codes = { 1: 'negada', 2: 'indisponivel', 3: 'tempo' };
        reject(new GeoError(codes[error.code] || 'indisponivel', messages[error.code] || messages[2]));
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  });
}

export function osmLink({ latitude, longitude }) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
}

export function osmEmbed({ latitude, longitude }) {
  const d = 0.004;
  const bbox = [longitude - d, latitude - d, longitude + d, latitude + d].map((n) => n.toFixed(6)).join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
}

/** Endereço aproximado a partir das coordenadas (Nominatim). Pode falhar sem impedir o cadastro. */
export async function reverseGeocode({ latitude, longitude }, { signal } = {}) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: '1',
    'accept-language': 'pt-BR',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { signal });
  if (!response.ok) throw new GeoError('reverso', 'Não foi possível obter o endereço aproximado.');
  const data = await response.json();
  if (!data || data.error || !data.address) throw new GeoError('reverso', 'Endereço aproximado não encontrado para este local.');
  const a = data.address;
  return {
    descricao: data.display_name || '',
    cep: (a.postcode || '').replace(/\D/g, '').slice(0, 8),
    logradouro: a.road || a.pedestrian || a.footway || '',
    bairro: a.suburb || a.neighbourhood || a.quarter || a.city_district || '',
    cidade: a.city || a.town || a.village || a.municipality || '',
    estado: ufFromIso(a['ISO3166-2-lvl4']),
  };
}

function ufFromIso(code) {
  // Ex.: "BR-SP" -> "SP"
  return typeof code === 'string' && code.startsWith('BR-') ? code.slice(3) : '';
}

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
