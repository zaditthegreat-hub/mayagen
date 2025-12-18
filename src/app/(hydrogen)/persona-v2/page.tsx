// ============================================================================
// DUPLIKAT-V2: Main Page untuk Text Chatbot Version
// Dibuat: 2025-12-18
// Untuk menghapus: Hapus folder persona-v2 beserta isinya
// ============================================================================

import CreateEditPersonaV2 from '@/app/shared/ecommerce/dashboard/create-edit-persona-v2';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Persona Playground - Text Chatbot'),
};

export default function PersonaV2Page() {
    return <CreateEditPersonaV2 />;
}
