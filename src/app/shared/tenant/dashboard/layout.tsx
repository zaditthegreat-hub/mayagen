"use client";

import { useParams } from 'next/navigation';
import { useLayout } from '@/layouts/use-layout';
// import { SelectedOptionProvider } from '@/hooks/use-selected-option';
import HydrogenLayout from '@/layouts/hydrogen/layout';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  const { layout } = useLayout();
  return (
    // <SelectedOptionProvider>
    <HydrogenLayout>{children}</HydrogenLayout>
    // </SelectedOptionProvider>
  );
}