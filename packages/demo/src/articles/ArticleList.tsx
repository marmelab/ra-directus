import React from 'react';
import {
    BulkDeleteButton,
    BulkUpdateButton,
    Datagrid,
    DateField,
    DateInput,
    List,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    SelectInput,
    TextField,
    TextInput,
} from 'react-admin';

const ArticleBulkActionButtons = () => (
    <>
        <BulkUpdateButton label="Archive" data={{ status: 'archived' }} />
        <BulkDeleteButton />
    </>
);

const articleFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput source="slug/_starts_with" label="Slug starts with" />,
    <DateInput source="publish_date/_gte" label="Published after" />,
    <DateInput source="publish_date/_lte" label="Published before" />,
    <SelectInput
        source="status"
        choices={[
            { id: 'draft', name: 'Draft' },
            { id: 'published', name: 'Published' },
            { id: 'archived', name: 'Archived' },
        ]}
    />,
    <ReferenceInput source="author" reference="directus_users">
        <SelectInput optionText="email" />
    </ReferenceInput>,
];

const ArticleList = () => (
    <List filters={articleFilters}>
        <Datagrid
            rowClick="edit"
            bulkActionButtons={<ArticleBulkActionButtons />}
        >
            <TextField source="id" />
            <ReferenceField source="author" reference="directus_users">
                <TextField source="email" />
            </ReferenceField>
            <DateField source="date_created" />
            <DateField source="publish_date" />
            <TextField source="slug" />
            <TextField source="status" />
        </Datagrid>
    </List>
);

export default ArticleList;
