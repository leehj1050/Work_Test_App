
export const getSelectedMap = (selectedIds) =>
    selectedIds.reduce((previous, current) => {
        previous[current] = true;
        return previous;
    }, {})