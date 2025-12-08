import CreateEditPersona from '@/app/shared/ecommerce/dashboard/create-edit-persona';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Create Persona Template'),
};

export default function CreatePersonaPage() {
    return <CreateEditPersona />;
}
