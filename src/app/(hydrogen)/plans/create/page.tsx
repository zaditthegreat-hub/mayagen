import CreateEditPlan from '@/app/shared/ecommerce/dashboard/create-edit-plan';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Create Plan'),
};

export default function CreatePlanPage() {
    return <CreateEditPlan />;
}
