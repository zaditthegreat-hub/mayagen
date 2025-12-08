import CreateEditPersona from '@/app/shared/ecommerce/dashboard/create-edit-persona';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Persona Template'),
};

export default async function EditPersonaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CreateEditPersona id={id} />;
}
