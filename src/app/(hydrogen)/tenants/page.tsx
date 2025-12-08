import TenantList from '@/app/shared/ecommerce/dashboard/tenant-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Tenants'),
};

export default function TenantsPage() {
    return <TenantList />;
}
