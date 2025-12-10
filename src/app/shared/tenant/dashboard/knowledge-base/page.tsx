"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import FileStats from '@/app/shared/file/manager/file-stats';
import { metaObject } from '@/config/site.config';
import UploadButtonClient from './upload-button-client';
import PageLayout from '../../cs/knowledge-base/page-layout';
import { getDocuments } from '@/api';
import { deleteDocumentAction, downloadDocumentAction } from './actions';

export default function FileListPage() {
  const { tenantId } = useParams();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const docs = await getDocuments(tenantId);
        setDocuments(docs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch documents');
        setLoading(false);
        console.error(err);
      }
    }

    fetchDocuments();
  }, [tenantId]);

  const pageHeader = {
    title: 'Knowledge Base',
    breadcrumb: [
      {
        href: `/${tenantId}${routes.mayaCS.dashboard.replace('/[tenantId]', '')}`,
        name: 'Home',
      },
      {
        href: `/${tenantId}${routes.mayaCS.knowledge.replace('/[tenantId]', '')}`,
        name: 'AI Knowledge',
      },
      {
        name: 'List',
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageHeader title="Knowledge Base" breadcrumb={pageHeader.breadcrumb} >
        <UploadButtonClient />
      </PageHeader>

      <FileStats />
      <PageLayout documents={documents} onDelete={(key) => deleteDocumentAction(key, tenantId as string)} onDownload={(key) => downloadDocumentAction(key, tenantId as string)} />
    </>
  );
}
