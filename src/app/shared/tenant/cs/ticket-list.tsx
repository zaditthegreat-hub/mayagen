'use client';

import WidgetCard from '@core/components/cards/widget-card';
import DropdownAction from '@core/components/charts/dropdown-action';
import cn from '@core/utils/class-names';
import { PiCheckBold } from 'react-icons/pi';
import { AdvancedCheckbox, Button } from 'rizzui';
import { useEffect, useState } from 'react';

interface Topic {
  topic: string;
  total_count: string;
}

const viewOptions = [
  { value: 'All', label: 'All' },
  { value: 'Cluster', label: 'Cluster' },
  { value: 'KPR', label: 'KPR' },
  { value: 'SerahTerima', label: 'Serah Terima' },
];

const dummyTopTopics: Topic[] = [
  { topic: 'Progres Pembangunan Cluster Lavender', total_count: '32' },
  { topic: 'Keterlambatan Serah Terima Unit', total_count: '18' },
  { topic: 'Permintaan Perbaikan Dinding Retak', total_count: '14' },
  { topic: 'Pengajuan KPR Bank Mandiri', total_count: '12' },
  { topic: 'Penggantian Spesifikasi Material', total_count: '9' },
  { topic: 'Biaya AJB & Balik Nama', total_count: '7' },
];

export default function AppointmentTodo({ className }: { className?: string }) {
  const [topTopics, setTopTopics] = useState<Topic[]>([]);

  useEffect(() => {
    // gunakan dummy data
    setTopTopics(dummyTopTopics);
  }, []);

  function handleChange(viewType: string) {
    console.log('viewType', viewType);
  }

  return (
    <WidgetCard
      title="Tickets"
      titleClassName="text-gray-800 sm:text-lg font-inter"
      className={cn('overflow-hidden bg-gray-50 @container', className)}
      action={
        <DropdownAction
          inPortal={false}
          className="rounded-lg border"
          options={viewOptions}
          onChange={handleChange}
          selectClassName="min-w-[120px]"
          prefixIconClassName="hidden"
          dropdownClassName="!z-[11]"
        />
      }
    >
      <div className="relative mt-7 h-[22rem]">
        <div className="custom-scrollbar relative -mx-3 -my-2 h-full w-[calc(100%+24px)] overflow-y-auto pb-24">
          <div className="relative before:absolute before:start-9 before:top-3 before:z-0 before:h-[calc(100%-24px)] before:w-1 before:bg-gray-200">
            {topTopics.map((item, index) => (
              <AdvancedCheckbox
                name="topic"
                value={item.topic}
                key={index}
                className="relative z-10 mt-0.5 px-3 py-1.5"
                contentClassName="flex w-full bg-gray-0 items-center px-4 py-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#D9B34E]">
                  <PiCheckBold className="fill-[#2B7F75] opacity-0" />
                </span>
                <div className="block ms-4">
                  <strong className="font-semibold text-gray-900">
                    {item.topic}
                  </strong>
                  <div className="pt-1.5 text-gray-500">
                    {item.total_count} kali dilaporkan
                  </div>
                </div>
              </AdvancedCheckbox>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 z-20 flex h-32 w-full items-end justify-center bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <Button rounded="lg" className="bg-gray-0 text-gray-800 shadow-md">
            View All Tickets
          </Button>
        </div>
      </div>
    </WidgetCard>
  );
}
