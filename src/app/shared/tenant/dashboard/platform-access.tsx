'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import HourGlassIcon from '@core/components/icons/hour-glass';
import WeighingScale from '@core/components/icons/weighing-scale';

// UBAH WARNA UNTUK ROLE BARU
const COLORS = {
  customer_service: '#1D4ED8',
  business_development: '#9333EA',
  sales: '#F59E0B',
  marketing: '#10B981',
};

// UBAH DATA CHART MENJADI ROLE BARU
const dataChart = (data: { customer_service: number; business_development: number; sales: number; marketing: number }) => [
  { name: 'Customer Service', value: data?.customer_service, color: COLORS.customer_service },
  { name: 'Business Development', value: data?.business_development, color: COLORS.business_development },
  { name: 'Sales', value: data?.sales, color: COLORS.sales },
  { name: 'Marketing', value: data?.marketing, color: COLORS.marketing },
];

export default function PlatformAccess({
  className,
  data,
  summary,
  selection,
}: {
  className?: string;
  data: { customer_service: number; business_development: number; sales: number; marketing: number };
  summary: { usersToday: number; messagesToday: number };
  selection: string;
}) {
  const getPeriod = (selection: string) => {
    if (selection === '1d') return 'Today';
    if (selection === '7d') return 'This Week';
    if (selection === '30d') return 'This Month';
    return 'Today';
  };

  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="grid items-start rounded-lg border border-muted p-5 @xl:grid-cols-2 lg:p-7">
        <Title
          as="h3"
          className="col-span-full mb-8 text-base font-semibold sm:text-lg"
        >
          Platform Access
        </Title>

        <div className="mb-6 w-full @3xl:w-40 @4xl:mb-0">
          <div className="mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
                <Pie
                  data={dataChart(data)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  strokeWidth={2}
                  paddingAngle={8}
                  innerRadius={40}
                  cornerRadius={6}
                  dataKey="value"
                >
                  {dataChart(data).map((item, index) => (
                    <Cell key={index} fill={item.color} stroke={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          {dataChart(data).map((item, index) => (
            <div
              key={index}
              className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-start">
                <span
                  className="me-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Title as="h5" className="text-sm font-medium">
                  {item.name}
                </Title>
              </div>
              <Text as="span">{item.value}</Text>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 rounded-lg border border-muted p-4 @2xl:grid-cols-2 @2xl:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center">
            <HourGlassIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{summary?.usersToday}</p>
            <p>Users {getPeriod(selection)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center">
            <WeighingScale className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{summary?.messagesToday}</p>
            <p>Messages {getPeriod(selection)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
