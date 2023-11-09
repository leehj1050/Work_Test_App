import React from "react";
import { Droppable } from "react-beautiful-dnd";

const containterStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginRight: `8px`,
    borderRadius: `5px`,
    border: `2px solid darkgrey`,
    backgroundColor: `#F4F5F7`
};

const itemListStyle = (isDraggingOver) => {
    return {
        flex: 1,
        padding: `8px`,
        transition: "background-color 0.2s ease",
        backgroundColor: isDraggingOver ? `rgba(0,0,0,.1)` : ""
    };
};

const Container = ({ children }) => (
    <div style={containterStyle}>{children}</div>
);

const ItemList = ({ innerRef, isDraggingOver, children }) => {
    return (
        <div style={itemListStyle(isDraggingOver)} ref={innerRef}>
            {children}
        </div>
    );
};

export default function DndDroppable({droppableId,type = "DEFAULT", children}) {
    return (
        <Container>
            <Droppable droppableId={droppableId} type={type}>
                {(provided, snapshot) => {
                    return (
                        <ItemList
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                        >
                            {children(provided, snapshot)}
                            {provided.placeholder}
                        </ItemList>
                    );
                }}
            </Droppable>
        </Container>
    );
}
