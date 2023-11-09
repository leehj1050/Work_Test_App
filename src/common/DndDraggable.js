'use client'
import React, {useState} from "react";
import { Draggable } from "react-beautiful-dnd";
import {keyCodes} from "@/common/keyCodes";
import {SelectionCount} from "@/common/SelectionCount";
import styles from '../styles/DndDraggable.module.css'


const primaryButton = 0;

/**
 * 옮길때 남아있는 color
 * */
const getBackgroundColor = ({ isSelected, isGhosting }) => {
    if (isGhosting) {
        return "lightgray"; //다중선택시
    }
    if (isSelected) {
        return "#DEEBFF"; //select 했을때 백그라운드 color
    }
    return "#fff";
};
/**
 * fontColor
 * */
const getColor = ({ isSelected, isGhosting }) => {
    if (isGhosting) {
        return "black"; //다중선택시
    }
    if (isSelected) {
        return "black";
    }
    return "black";
};

const getItemStyle = (isDragging, isSelected, isGhosting, draggableStyle) => ({
    backgroundColor: getBackgroundColor({ isSelected, isGhosting }),
    color: getColor({ isSelected, isGhosting }),
    boxShadow: isDragging ? "2px dotted border" : "none",
    opacity: isGhosting ? "0.8" : "1",
    position: "relative" /* needed for SelectionCount */,
    padding: `10px`,
    margin: `0 0 8px 0`,
    borderRadius: `5px`,
    fontSize: `15px`,
    fontFamily: "Arial",
    userSelect: "none",
    height:'100px',
    ...draggableStyle
});

const DraggableContainer = ({provided,innerRef,onClick,onTouchEnd, onKeyDown,isDragging,isSelected,
 isGhosting,children}) => (
    <div className={styles.item}
         ref={innerRef}
         {...provided.draggableProps}
         {...provided.dragHandleProps}
         style={getItemStyle(
             isDragging,
             isSelected,
             isGhosting,
             provided.draggableProps.style //움직이는 동작
         )}
         onClick={onClick}
         onTouchEnd={onTouchEnd}
         onKeyDown={onKeyDown}
    >
        {children}
    </div>
)

export function DndDraggable({item,toggleSelection,toggleSelectionInGroup, multiSelectTo,draggableId,index,
  selectionCount = 0, isSelected,isGhosting, children}) {
    const onKeyDown = (event, provided, snapshot) => {
        if (event.defaultPrevented) {
            return;
        }
        if (snapshot.isDragging) {
            return;
        }
        if (event.keyCode !== keyCodes.enter) {
            return;
        }
        // we are using the event for selection
        event.preventDefault();
        performAction(event);
    };

    // Using onClick as it will be correctly preventing if there was a drag
    const onClick = (event) => {
        if (event.defaultPrevented) {
            return;
        }
        if (event.button !== primaryButton) {
            return;
        }
        // marking the event as used
        event.preventDefault();
        performAction(event);
    };

    const onTouchEnd = (event) => {
        if (event.defaultPrevented) {
            return;
        }
        // marking the event as used
        // we would also need to add some extra logic to prevent the click if this element was an anchor
        event.preventDefault();
        toggleSelectionInGroup(item.id);
    };

    // Determines if the platform specific toggle selection in group key was used
    const wasToggleInSelectionGroupKeyUsed = (event) => {
        const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
        return isUsingWindows ? event.ctrlKey : event.metaKey;
    };

    // Determines if the multiSelect key was used
    const wasMultiSelectKeyUsed = (event) => event.shiftKey;

    const performAction = (event) => {
        if (wasToggleInSelectionGroupKeyUsed(event)) {
            toggleSelectionInGroup(item.id);
            return;
        }
        if (wasMultiSelectKeyUsed(event)) {
            multiSelectTo(item.id);
            return;
        }
        toggleSelection(item.id);
    };

    return (
        <Draggable draggableId={draggableId} index={index}>
            {(provided, snapshot) => {
                const shouldShowSelection = snapshot.isDragging && selectionCount > 1;
                return (
                    <DraggableContainer
                        provided={provided}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={onClick}
                        onTouchEnd={onTouchEnd}
                        onKeyDown={(e) => onKeyDown(e, provided, snapshot)}
                        isDragging={snapshot.isDragging}
                        isSelected={isSelected}
                        isGhosting={isGhosting}
                    >
                        {children(provided, snapshot)}
                        {shouldShowSelection ? (
                            <SelectionCount>{selectionCount}</SelectionCount>
                        ) : null}
                    </DraggableContainer>
                );
            }}
        </Draggable>
    );
}
