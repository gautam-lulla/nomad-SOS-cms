interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  dietary?: string[];
}

interface MenuCategoryProps {
  entry: string;
  name: string;
  availability?: string;
  items: MenuItem[];
  index: number;
}

export function MenuCategory({
  entry,
  name,
  availability,
  items,
  index,
}: MenuCategoryProps) {
  return (
    <section className="py-10 border-t border-off-white/20 first:border-t-0">
      {/* Category Header */}
      <div className="mb-8">
        <h2
          className="font-sabon text-[36px] leading-[1.3] tracking-[-0.72px] text-off-white"
          data-cms-entry={entry}
          data-cms-field={`categories[${index}].name`}
        >
          {name}
        </h2>
        {availability && (
          <p
            className="font-gotham font-bold text-xs uppercase tracking-[0.36px] text-off-white/60 mt-2"
            data-cms-entry={entry}
            data-cms-field={`categories[${index}].availability`}
          >
            {availability}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3
                  className="font-sabon text-[20px] leading-[1.3] tracking-[-0.4px] text-off-white"
                  data-cms-entry={entry}
                  data-cms-field={`categories[${index}].items[${itemIndex}].name`}
                >
                  {item.name}
                </h3>
                {item.dietary && item.dietary.length > 0 && (
                  <div className="flex gap-1">
                    {item.dietary.map((diet, dietIndex) => (
                      <span
                        key={dietIndex}
                        className="font-gotham font-bold text-[10px] uppercase tracking-[0.3px] text-pink-400 border border-pink-400 px-2 py-0.5"
                        title={diet}
                      >
                        {diet.charAt(0)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {item.description && (
                <p
                  className="font-sabon text-base leading-[1.6] tracking-[-0.32px] text-off-white/70 mt-1"
                  data-cms-entry={entry}
                  data-cms-field={`categories[${index}].items[${itemIndex}].description`}
                >
                  {item.description}
                </p>
              )}
            </div>
            {item.price && (
              <span
                className="font-gotham font-bold text-sm uppercase tracking-[0.42px] text-off-white flex-shrink-0"
                data-cms-entry={entry}
                data-cms-field={`categories[${index}].items[${itemIndex}].price`}
              >
                {item.price}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
