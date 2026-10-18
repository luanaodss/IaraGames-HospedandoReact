import searchIcon from '../assets/icons/busca.svg';

// Campo de busca do catálogo (reaproveitado da versão React anterior).
export default function SearchBar({ value, onChange, id = 'catalog-search', placeholder = 'Busque por nome, estúdio ou categoria' }) {
  return (
    <form className="search-wrap catalog-search" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="search-box" htmlFor={id}>
        <span className="visually-hidden">Buscar jogos</span>
        <input
          id={id}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onChange('');
          }}
        />
        <img src={searchIcon} alt="" />
      </label>
    </form>
  );
}
