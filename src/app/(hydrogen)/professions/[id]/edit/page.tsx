import CreateEditProfession from '@/app/shared/ecommerce/dashboard/create-edit-profession';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Profession'),
};

export default function EditProfessionPage({ params }: { params: { id: string } }) {
    return <CreateEditProfession id={params.id} />;
}
