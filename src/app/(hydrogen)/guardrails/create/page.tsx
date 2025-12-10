import CreateEditGuardrail from '@/app/shared/ecommerce/dashboard/create-edit-guardrail';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Create Guardrail'),
};

export default function CreateGuardrailPage() {
    return <CreateEditGuardrail />;
}
