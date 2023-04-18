import React from "react";
import {Pagination} from "react-bootstrap";

export default function ({pageNumber, hasNext, updateResult}) {
    if (pageNumber <= 0) return <p>Loading&hellip;</p>;

    return <Pagination className="justify-content-end">
        {pageNumber > 1 && <>
            <Pagination.Item onClick={() => updateResult(pageNumber - 1)}>
                Previous</Pagination.Item>
            <Pagination.Item onClick={() => updateResult(1)}>1</Pagination.Item>
        </>}
        {pageNumber > 2 &&
            <Pagination.Ellipsis disabled></Pagination.Ellipsis>}
        <Pagination.Item active>{pageNumber}</Pagination.Item>
        {hasNext && <>
            <Pagination.Ellipsis disabled></Pagination.Ellipsis>
            <Pagination.Item onClick={() => updateResult(pageNumber + 1)}>
                Next</Pagination.Item>
        </>}
    </Pagination>
}
