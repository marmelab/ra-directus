import React from 'react';
import {
    Edit,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput,
} from 'react-admin';

const ArticleEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="author" reference="directus_users">
                <SelectInput optionText="email" />
            </ReferenceInput>
            <TextInput source="slug" fullWidth />
            <SelectInput
                source="status"
                choices={[
                    { id: 'draft', name: 'Draft' },
                    { id: 'published', name: 'Published' },
                    { id: 'archived', name: 'Archived' },
                ]}
            />
        </SimpleForm>
    </Edit>
);

export default ArticleEdit;
