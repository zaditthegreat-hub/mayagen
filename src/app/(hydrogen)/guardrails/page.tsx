import GuardrailList from '@/app/shared/ecommerce/dashboard/guardrail-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Guardrails'),
};

export default function GuardrailsPage() {
    return <GuardrailList />;
}
