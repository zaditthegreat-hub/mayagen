import PersonaList from '@/app/shared/ecommerce/dashboard/persona-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Persona Templates'),
};

export default function PersonaTemplatesPage() {
    return <PersonaList />;
}
