import CreateEditProfession from '@/app/shared/ecommerce/dashboard/create-edit-profession';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Profession'),
};

export default async function EditProfessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CreateEditProfession id={id} />;
}
