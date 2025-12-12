'use client';

import { useSearchParams } from 'next/navigation';
import FileGrid from '@/app/shared/file/manager/file-grid';
import FileListTable from '@/app/shared/file/manager/file-list/table';

interface PageLayoutProps {
  documents: any[];
  onDelete: (key: string) => void;
  onDownload: (key: string) => void;
}

export default function PageLayout({ documents, onDelete, onDownload }: PageLayoutProps) {
  const searchParams = useSearchParams();
  const layout = searchParams.get('layout');
  const isGridLayout = layout?.toLowerCase() === 'grid';

  return isGridLayout ? (
    <FileGrid documents={documents} />
  ) : (
    <FileListTable documents={documents} onDelete={onDelete} onDownload={onDownload} />
  );
}
