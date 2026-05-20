export function buildFilterOptions(items, getValue) {
    const names = [...new Set(items.map(getValue).filter(Boolean))];

    return [{ id: 'all', name: 'All' }, ...names.map((name) => ({ id: name, name }))];
}

export function enrichCategoryFilterOptions(options, getCategoryIcon) {
    return options.map((option, index) =>
        option.id === 'all'
            ? { ...option, icon: 'business' }
            : {
                  id: String(index),
                  name: option.name,
                  icon: getCategoryIcon(option.name),
              }
    );
}
