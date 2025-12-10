'use client';

import WidgetCard from '@core/components/cards/widget-card';
import DropdownAction from '@core/components/charts/dropdown-action';
import DateCell from '@core/ui/date-cell';
import cn from '@core/utils/class-names';
import { PiCheckBold } from 'react-icons/pi';
import { AdvancedCheckbox, Button } from 'rizzui';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTopTopics } from '@/api';

interface Topic {
  topic: string;
  total_count: string;
}

const viewOptions = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'Cancer',
    label: 'Cancer',
  },
  {
    value: 'Pregnancy',
    label: 'Pregnancy',
  },
  {
    value: 'Dentist',
    label: 'Dentist',
  },
];

export default function AppointmentTodo({ className }: { className?: string }) {
  const { tenantId } = useParams();
  const [topTopics, setTopTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function fetchTopTopics() {
      try {
        const response = await getTopTopics(tenantId);
        setTopTopics(response);
      } catch (error) {
        console.error("Failed to fetch top topics:", error);
      }
    }
    fetchTopTopics();
  }, [tenantId]);

  function handleChange(viewType: string) {
    console.log('viewType', viewType);
  }

  return (
    <WidgetCard
      title="Top Topics"
      titleClassName="text-gray-800 sm:text-lg font-inter"
      headerClassName="items-center"
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
          <div className="relative before:absolute before:start-9 before:top-3 before:z-0 before:h-[calc(100%-24px)] before:w-1 before:translate-x-0.5 before:bg-gray-200">
            {topTopics.map((item, index) => (
              <AdvancedCheckbox
                name="topic"
                value={item.topic}
                key={index}
                className="relative z-10 mt-0.5 px-3 py-1.5"
                inputClassName="[&:checked~.rizzui-advanced-checkbox]:ring-muted [&:checked~.rizzui-advanced-checkbox>span>svg]:opacity-100 [&:checked~.rizzui-advanced-checkbox>span]:border-[#2B7F75] [&:checked~.rizzui-advanced-checkbox>div>div>strong]:line-through [&:checked~.rizzui-advanced-checkbox>div>div>strong]:text-gray-500 [&:checked~.rizzui-advanced-checkbox>div>div>strong+span]:line-through"
                contentClassName="flex w-full bg-gray-0 dark:bg-gray-50 items-center @md:px-5 px-4 py-4 rounded-lg shadow hover:shadow-md transition-shadow border-0 @md:gap-5 gap-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#D9B34E]">
                  <PiCheckBold className="fill-[#2B7F75] opacity-0" />
                </span>
                <div className="block">
                  <div className="text-gray-600">
                    <strong className="font-semibold text-gray-900">
                      {item.topic}
                    </strong>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    <span className="font-normal text-gray-500">
                      {item.total_count} kali diperbincangkan
                    </span>
                  </div>
                </div>
              </AdvancedCheckbox>
            ))}
          </div>
        </div>
        <div className="absolute -start-0.5 bottom-0 z-20 flex h-32 w-[101%] items-end justify-center bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <Button
            rounded="lg"
            className="bg-gray-0 text-gray-800 shadow-md transition-shadow hover:bg-gray-0 hover:shadow dark:hover:bg-gray-0"
          >
            View All
          </Button>
        </div>
      </div>
    </WidgetCard>
  );
}
