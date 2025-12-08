import EditTenant from '@/app/shared/ecommerce/dashboard/edit-tenant';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Tenant'),
};

export default async function EditTenantPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EditTenant id={id} />;
}
