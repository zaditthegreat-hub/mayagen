import CreateEditPlan from '@/app/shared/ecommerce/dashboard/create-edit-plan';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Plan'),
};

export default async function EditPlanPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return <CreateEditPlan id={code} />;
}
