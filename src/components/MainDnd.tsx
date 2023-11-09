import React, { useState } from "react";
import { DndContext } from '@/common/DndContext';
import Column from "./Column";

const Container = ({ children }) => (
    <div
        style={{
            display: "flex",
            height: '2000px', // height minus padding
            userSelect: "none",
            width:'100%'
        }}
    >
        {children}
    </div>
);

const getItems = (dragGroup, columnId) => {
    console.log({ dragGroup });
    console.log({ columnId });
    return dragGroup?.columns[columnId].itemIds?.map(
        (id) => dragGroup.itemsObject[id]
    );
};



export default function MainDnd() {
        return (
            <DndContext>
                {({
                      draggingItemId,
                      dragGroupBreakdowns,
                      dragGroupManagerList,
                      selectedBreakdownIds,
                      selectedManagerListIds,
                      toggleSelection,
                      toggleSelectionInGroup,
                      multiSelectTo
                  }) => (
                   <div style={{border:'1px solid red', display:'flex'}}>
                       <Container>
                           <Column
                               type="dragGroupBreakdowns"
                               columnId="todo"
                               items={getItems(dragGroupBreakdowns, "todo")}
                               selectedIds={selectedBreakdownIds}
                               draggingItemId={draggingItemId}
                               toggleSelection={toggleSelection}
                               toggleSelectionInGroup={toggleSelectionInGroup}
                               multiSelectTo={multiSelectTo}
                           />
                           <Column
                               type="dragGroupBreakdowns"
                               columnId="inprogress"
                               items={getItems(dragGroupBreakdowns, "inprogress")}
                               selectedIds={selectedBreakdownIds}
                               draggingItemId={draggingItemId}
                               toggleSelection={toggleSelection}
                               toggleSelectionInGroup={toggleSelectionInGroup}
                               multiSelectTo={multiSelectTo}
                           />
                           <Column
                               type="dragGroupBreakdowns"
                               columnId="completed"
                               items={getItems(dragGroupBreakdowns, "completed")}
                               selectedIds={selectedBreakdownIds}
                               draggingItemId={draggingItemId}
                               toggleSelection={toggleSelection}
                               toggleSelectionInGroup={toggleSelectionInGroup}
                               multiSelectTo={multiSelectTo}
                           />
                           <Column
                               type="dragGroupBreakdowns"
                               columnId="verified"
                               items={getItems(dragGroupBreakdowns, "verified")}
                               selectedIds={selectedBreakdownIds}
                               draggingItemId={draggingItemId}
                               toggleSelection={toggleSelection}
                               toggleSelectionInGroup={toggleSelectionInGroup}
                               multiSelectTo={multiSelectTo}
                           />
                           {/* <Column
              type="dragGroupBreakdowns"
              columnId="ba"
              items={getItems(dragGroupBreakdowns, "ba")}
              selectedIds={selectedBreakdownIds}
              draggingItemId={draggingItemId}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
            />
             <Column
              type="dragGroupBreakdowns"
              columnId="pm"
              items={getItems(dragGroupBreakdowns, "pm")}
              selectedIds={selectedBreakdownIds}
              draggingItemId={draggingItemId}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
            /> */}
                           {/* <Column
              type='dragGroupManagerList'
              columnId='managerList'
              items={getItems(dragGroupManagerList, 'managerList')}
              selectedIds={selectedManagerListIds}
              draggingItemId={draggingItemId}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
            /> */}
                       </Container>

                   </div>
                )}
            </DndContext>
        );
}