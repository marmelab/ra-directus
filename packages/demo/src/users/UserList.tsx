import React from 'react';
import { Datagrid, EmailField, List, TextField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <EmailField source="email" />
        </Datagrid>
    </List>
);

export default UserList;
