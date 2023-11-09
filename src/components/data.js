const dnpSettingConst = {
    LIST: [
        { id: "item1", content: "item1" },
        { id: "item2", content: "item2" },
        { id: "item3", content: "item3" },
        { id: "item4", content: "item4" },
        { id: "item5", content: "item5" },
        { id: "item6", content: "item6" },
        { id: "item7", content: "item7" },
        { id: "item8", content: "item8" }
    ]
};

const breakdownMap = (array) =>
    array.reduce((previous, current) => {
        previous[current.id] = current;
        return previous;
    }, {});

const dragGroups = [
    {
        name: "dragGroupBreakdowns",
        selectedList: "selectedBreakdownIds",
        columns: {
            todo: {
                id: "todo",
                itemIds: dnpSettingConst.LIST.map((item) => item.id)
            },
            inprogress: { id: "inprogress", itemIds: [] },
            completed: { id: "completed", itemIds: [] },
            verified: { id: "verified", itemIds: [] }
        },
        itemsObject: breakdownMap(dnpSettingConst.LIST)
    }
];

export { dragGroups };
