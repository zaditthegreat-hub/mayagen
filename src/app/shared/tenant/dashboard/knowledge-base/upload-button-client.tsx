'use client';

import { useRouter, useParams } from 'next/navigation';
import UploadButton from '@/app/shared/upload-button';
import FileUpload from '@/app/shared/file-upload';
import { uploadDocument } from '@/api';

export default function UploadButtonClient() {
  const { tenantId } = useParams();
  const router = useRouter();
  return (
    <UploadButton
      modalView={
        <FileUpload
          onUpload={async (files: File[]) => {
            if (files.length === 0) return;

            const file = files[0];
            const result = await uploadDocument(file, tenantId);

            console.log("Upload result:", result);

            // refresh server component
            router.refresh();
          }}
        />
      }
    />
  );
}