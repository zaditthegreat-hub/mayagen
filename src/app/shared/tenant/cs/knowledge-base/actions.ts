'use client';

import { deleteDocument, downloadDocument } from '@/api';
// import { revalidatePath } from 'next/cache';

export async function deleteDocumentAction(key: string, tenantId: string) {
  try {
    await deleteDocument(key, tenantId);
    // revalidatePath('/apps/isomorphic/src/app/(hydrogen)/maya-cs/knowledge-base');
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function downloadDocumentAction(key: string, tenantId: string) {
  try {
    await downloadDocument(key, tenantId);
    return { success: true };
  } catch (error) {
    // console.error('Error downloading document:', error);
    return { success: false, error: (error as Error).message };
  }
}