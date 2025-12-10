import CreateEditGuardrail from '@/app/shared/ecommerce/dashboard/create-edit-guardrail';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Edit Guardrail'),
};

export default async function EditGuardrailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CreateEditGuardrail id={id} />;
}
