// import { invariant } from 'react-beautiful-dnd';
import reorder from "./reorder";

const withNewItemIds = (column, itemIds) => ({
    id: column.id,
    itemIds
});

const reorderSingleDrag = ({
                               dragGroup,
                               selectedItemIds,
                               source,
                               destination
                           }) => {
    // moving in the same list
    if (source.droppableId === destination.droppableId) {
        const column = dragGroup.columns[source.droppableId];
        const reordered = reorder(column.itemIds, source.index, destination.index);

        const updated = {
            ...dragGroup,
            columns: {
                ...dragGroup.columns,
                [column.id]: withNewItemIds(column, reordered)
            }
        };

        return { dragGroup: updated, selectedItemIds };
    }

    // moving to a new list
    const home = dragGroup.columns[source.droppableId];
    const foreign = dragGroup.columns[destination.droppableId];

    // the id of the item to be moved
    const itemId = home.itemIds[source.index];

    // remove from home column
    const newHomeItemIds = [...home.itemIds];
    newHomeItemIds.splice(source.index, 1);

    // add to foreign column
    const newForeignItemIds = [...foreign.itemIds];
    newForeignItemIds.splice(destination.index, 0, itemId);

    const updated = {
        ...dragGroup,
        columns: {
            ...dragGroup.columns,
            [home.id]: withNewItemIds(home, newHomeItemIds),
            [foreign.id]: withNewItemIds(foreign, newForeignItemIds)
        }
    };

    return { dragGroup: updated, selectedItemIds };
};

export const getHomeColumn = (dragGroup, itemId) => {
    for (let key in dragGroup.columns) {
        if (dragGroup.columns[key].itemIds.includes(itemId))
            return dragGroup.columns[key];
    }
};

const reorderMultiDrag = ({
                              dragGroup,
                              selectedItemIds,
                              source,
                              destination
                          }) => {
    console.log({ dragGroup });
    const start = dragGroup.columns[source.droppableId];
    const dragged = start.itemIds[source.index];

    const insertAtIndex = (() => {
        const destinationIndexOffset = selectedItemIds.reduce(
            (previous, current) => {
                if (current === dragged) return previous;

                const final = dragGroup.columns[destination.droppableId];
                const column = getHomeColumn(dragGroup, current);

                if (column !== final) return previous;

                const index = column.itemIds.indexOf(current);

                if (index >= destination.index) return previous;

                // the selected item is before the destination index
                // we need to account for this when inserting into the new location
                return previous + 1;
            },
            0
        );

        const result = destination.index - destinationIndexOffset;
        return result;
    })();

    // doing the ordering now as we are required to look up columns
    // and know original ordering
    const orderedSelectedItemIds = [...selectedItemIds];
    orderedSelectedItemIds.sort((a, b) => {
        // moving the dragged item to the top of the list
        if (a === dragged) return -1;
        if (b === dragged) return 1;

        // sorting by their natural indexes
        const columnForA = getHomeColumn(dragGroup, a);
        const indexOfA = columnForA.itemIds.indexOf(a);
        const columnForB = getHomeColumn(dragGroup, b);
        const indexOfB = columnForB.itemIds.indexOf(b);

        if (indexOfA !== indexOfB) return indexOfA - indexOfB;

        // sorting by their order in the selectedItemIds list
        return -1;
    });

    // we need to remove all of the selected items from their columns
    const withRemovedItems = Object.keys(dragGroup.columns).reduce(
        (previous, columnId) => {
            const column = dragGroup.columns[columnId];

            // remove the id's of the items that are selected
            const remainingItemIds = column.itemIds.filter(
                (id) => !selectedItemIds.includes(id)
            );

            previous[column.id] = withNewItemIds(column, remainingItemIds);
            return previous;
        },
        dragGroup.columns
    );

    const final = withRemovedItems[destination.droppableId];
    const withInserted = (() => {
        const base = [...final.itemIds];
        base.splice(insertAtIndex, 0, ...orderedSelectedItemIds);
        return base;
    })();

    // insert all selected items into final column
    const withAddedItems = {
        ...withRemovedItems,
        [final.id]: withNewItemIds(final, withInserted)
    };

    const updated = { ...dragGroup, columns: withAddedItems };

    return { dragGroup: updated, selectedItemIds: orderedSelectedItemIds };
};

export const mutliDragAwareReorder = (args) => {
    return args.selectedItemIds.length > 1
        ? reorderMultiDrag(args)
        : reorderSingleDrag(args);
};

export const multiSelect = (dragGroup, selectedItemIds, newItemId) => {
    // Nothing already selected
    if (!selectedItemIds.length) return [newItemId];

    const columnOfNew = getHomeColumn(dragGroup, newItemId);
    const indexOfNew = columnOfNew.itemIds.indexOf(newItemId);

    const lastSelected = selectedItemIds[selectedItemIds.length - 1];
    const columnOfLast = getHomeColumn(dragGroup, lastSelected);
    const indexOfLast = columnOfLast.itemIds.indexOf(lastSelected);

    // multi selecting to another column
    // select everything up to the index of the current item
    if (columnOfNew !== columnOfLast) {
        return columnOfNew.itemIds.slice(0, indexOfNew + 1);
    }

    // multi selecting in the same column
    // need to select everything between the last index and the current index inclusive

    // nothing to do here
    if (indexOfNew === indexOfLast) return null;

    const isSelectingForwards = indexOfNew > indexOfLast;
    const start = isSelectingForwards ? indexOfLast : indexOfNew;
    const end = isSelectingForwards ? indexOfNew : indexOfLast;

    const inBetween = columnOfNew.itemIds.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween.filter((itemId) => {
        // if already selected: then no need to select it again
        if (selectedItemIds.includes(itemId)) return false;
        return true;
    });

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    const combined = [...selectedItemIds, ...sorted];

    return combined;
};
