import { dragGroups } from '@/components/data'

export const getDragGroupByColumn = (key) => {
    for(let group of dragGroups) {
        if(group.columns.hasOwnProperty(key)) return group
    }
}