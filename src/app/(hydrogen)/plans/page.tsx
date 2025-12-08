import PlanList from '@/app/shared/ecommerce/dashboard/plan-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Plans'),
};

export default function PlansPage() {
    return <PlanList />;
}
