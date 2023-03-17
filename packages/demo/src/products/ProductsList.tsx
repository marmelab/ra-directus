import React from 'react';
import {
    ArrayField,
    ChipField,
    Datagrid,
    List,
    NumberField,
    SingleFieldList,
    TextField,
} from 'react-admin';

const ProductList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="description" />
            <TextField source="name" />
            <NumberField source="price" />
            <NumberField source="quantity" />
            <TextField source="status" />
            <TextField source="type" />
            <ArrayField source="variants">
                <SingleFieldList>
                    <ChipField source="color" />
                </SingleFieldList>
            </ArrayField>
            <TextField source="vendor" />
        </Datagrid>
    </List>
);

export default ProductList;
