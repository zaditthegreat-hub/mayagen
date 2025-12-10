import ProfessionList from '@/app/shared/ecommerce/dashboard/profession-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Professions'),
};

export default function ProfessionsPage() {
    return <ProfessionList />;
}
