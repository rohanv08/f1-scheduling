import React from "react";

export default function SortableColumn({field, children}) {
    let name = 'sorting ';
    let next = undefined;
    if (this.state.sortBy === field) {
        if (this.state.order !== 'desc') {
            next = 'desc';
        }
        if (this.state.order === undefined) this.state.order = 'asc';
        name += this.state.order;
    } else {
        next = 'asc';
    }
    return <th className={name} onClick={() => this.updateSort(field, next)}>{children}</th>
}
