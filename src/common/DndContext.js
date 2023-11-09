import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { dragGroups } from "@/components/data";
import {getDragGroupByColumn} from "@/common/getDragGroupByColumn";
import {multiSelect, mutliDragAwareReorder} from "@/common/utils";


export class DndContext extends Component {
    dragGroupState = {};
    foo = dragGroups?.forEach((group) => {
        this.dragGroupState[group.name] = group;
        this.dragGroupState[group.selectedList] = [];
    });
    state = {
        draggingItemId: null,
        ...this.dragGroupState
    };

    getDragGroupByItemId = (id) => {
        return dragGroups.find((group) => group.itemsObject.hasOwnProperty(id));
    };

    onDragStart = (start) => {
        const id = start.draggableId;
        const list = getDragGroupByColumn(start.source.droppableId);
        const selected = this.state[list.selectedList].find(
            (itemId) => itemId === id
        );
        if (!selected) this.setState({ [list.selectedList]: [start.draggableId] });
        this.setDraggingItemId(start.draggableId);
    };

    onDragEnd = (result) => {
        console.log("드래그END",{ result });
        const destination = result.destination;
        const source = result.source;
        const list = getDragGroupByColumn(result.source.droppableId);

        // nothing to do
        if (!destination || result.reason === "CANCEL") {
            this.setDraggingItemId(null);
            return;
        }
        const processed = mutliDragAwareReorder({
            dragGroup: this.state[list.name],
            selectedItemIds: this.state[list.selectedList],
            source,
            destination
        });
        this.setState({
            [list.name]: processed.dragGroup,
            [list.selectedList]: processed.selectedItemIds
        });
        this.setDraggingItemId(null);
    };

    toggleSelection = (itemId) => {
        const list = this.getDragGroupByItemId(itemId);
        const selectedIds = this.state[list.selectedList];
        const wasSelected = selectedIds.includes(itemId);
        const newItemIds = (() => {
            // Item was not previously selected, now will be the only selected item
            if (!wasSelected) {
                return [itemId];
            }
            // Item was part of a selected group, will now become the only selected item
            if (selectedIds.length > 1) {
                return [itemId];
            }
            // item was previously selected but not in a group, we will now clear the selection
            return [];
        })();
        this.setState({ [list.selectedList]: newItemIds });
    };

    toggleSelectionInGroup = (itemId) => {
        const list = this.getDragGroupByItemId(itemId);
        const selectedIds = this.state[list.selectedList];
        const index = selectedIds.indexOf(itemId);
        // if not selected - add it to the selected items
        if (index === -1) {
            this.setState({ selectedBreakdownIds: [...selectedIds, itemId] });
            return;
        }
        // it was previously selected and now needs to be removed from the group
        const shallow = [...selectedIds];
        shallow.splice(index, 1);
        this.setState({ [list.selectedList]: shallow });
    };

    // This behaviour matches the MacOSX finder selection
    multiSelectTo = (newItemId) => {
        const list = this.getDragGroupByItemId(newItemId);
        const updated = multiSelect(
            this.state[list.name],
            this.state[list.selectedList],
            newItemId
        );
        if (updated == null) {
            return;
        }
        this.setState({ [list.selectedList]: updated });
    };

    setDraggingItemId = (id) => this.setState({ draggingItemId: id });
    unselectAll = (key) => this.setState({ [key]: [] });

    render() {
        const { children } = this.props;
        const {
            draggingItemId,
            dragGroupBreakdowns,
            dragGroupManagerList,
            selectedBreakdownIds,
            selectedManagerListIds
        } = this.state;
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                {children({
                    draggingItemId,
                    dragGroupBreakdowns,
                    dragGroupManagerList,
                    selectedBreakdownIds,
                    selectedManagerListIds,
                    toggleSelection: this.toggleSelection,
                    toggleSelectionInGroup: this.toggleSelectionInGroup,
                    multiSelectTo: this.multiSelectTo
                })}
            </DragDropContext>
        );
    }
}
