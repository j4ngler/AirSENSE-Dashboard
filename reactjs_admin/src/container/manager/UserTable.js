import React, { Component } from 'react';
import TableUserView from '../../compoment/table/TableUserView';
const UserTable = (props) => {
  return <TableUserView table={props.resource} />;
};
export default UserTable;
