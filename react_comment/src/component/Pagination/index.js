import React from "react";
import { Pagination } from 'react-bootstrap';

const PaginationComment = ({ pagesCount, page, onClick }) => {

    let items = [];
    for (let index = 0; index < pagesCount; index++) {
      items.push(
        <Pagination.Item key={index} active={index === page } onClick={() =>{
         onClick(index+1)}} activeLabel="">
          {index+1}
        </Pagination.Item>
      );
    }
  
    return <Pagination>{items}</Pagination>;
}

export default PaginationComment;