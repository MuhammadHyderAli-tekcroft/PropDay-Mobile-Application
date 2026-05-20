export function filterByActiveOption(items, activeOption, getValue) {
    return !activeOption || activeOption === 'All'
        ? items
        : items.filter((item) => getValue(item) === activeOption);
}
