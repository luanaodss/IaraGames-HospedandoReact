export default function CategoryFilter({ categories, activeCategory, onSelect }) {
  return (
    <div className="category-row" role="group" aria-label="Filtrar por categoria">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-chip${category === activeCategory ? ' active' : ''}`}
          aria-pressed={category === activeCategory}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
