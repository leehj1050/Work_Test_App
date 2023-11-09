import React from "react";

import { DndDraggable } from "@/common/DndDraggable";

const Value = ({ children }) => <div>{children}</div>;

export function Item({ item = {}, index, isSelected = false,selectionCount = 0,isGhosting = false,toggleSelection,toggleSelectionInGroup, multiSelectTo}) {
    return (
        <DndDraggable
            draggableId={item.id}
            index={index}
            selectionCount={selectionCount}
            item={item}
            toggleSelection={toggleSelection}
            toggleSelectionInGroup={toggleSelectionInGroup}
            multiSelectTo={multiSelectTo}
            isSelected={isSelected}
            isGhosting={isGhosting}
        >
            {(provided, snapshot) => <Value>{item.content}</Value>}
        </DndDraggable>
    );
}
