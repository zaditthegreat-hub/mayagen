import CreateEditProfession from '@/app/shared/ecommerce/dashboard/create-edit-profession';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Create Profession'),
};

export default function CreateProfessionPage() {
    return <CreateEditProfession />;
}
