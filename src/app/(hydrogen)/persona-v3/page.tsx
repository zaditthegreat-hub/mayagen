// ============================================================================
// DUPLIKAT-V3: Main Page untuk Voice Avatar Version
// Dibuat: 2025-12-18
// Untuk menghapus: Hapus folder persona-v3 beserta isinya
// ============================================================================

import CreateEditPersonaV3 from '@/app/shared/ecommerce/dashboard/create-edit-persona-v3';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Persona Playground - Voice Avatar'),
};

export default function PersonaV3Page() {
    return <CreateEditPersonaV3 />;
}
