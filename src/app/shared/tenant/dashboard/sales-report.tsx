'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { CustomYAxisTick } from '@core/components/charts/custom-yaxis-tick';
import { useMedia } from '@core/hooks/use-media';
import { DatePicker } from '@core/ui/datepicker';
import { useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from 'rizzui';

const data = [
  {
    month: 'Jan',
    revenue: 5000,
    expense: 1500,
  },
  {
    month: 'Feb',
    revenue: 4600,
    expense: 3798,
  },
  {
    month: 'Mar',
    revenue: 5900,
    expense: 1300,
  },
  {
    month: 'Apr',
    revenue: 5780,
    expense: 3908,
  },
  {
    month: 'May',
    revenue: 4890,
    expense: 2500,
  },
  {
    month: 'Jun',
    revenue: 8000,
    expense: 3200,
  },
  {
    month: 'Jul',
    revenue: 4890,
    expense: 2500,
  },
  {
    month: 'Aug',
    revenue: 3780,
    expense: 3908,
  },
  {
    month: 'Sep',
    revenue: 7800,
    expense: 2800,
  },
  {
    month: 'Oct',
    revenue: 5780,
    expense: 1908,
  },
  {
    month: 'Nov',
    revenue: 2780,
    expense: 3908,
  },
  {
    month: 'Dec',
    revenue: 7500,
    expense: 3000,
  },
];

interface ReportDataRow {
  unique_users: number;
  new_users: number;
  returning_users: number;
  total_messages: number;
  total_tokens: number;
  avg_response_time: number | string;
  text_messages: number;
  whatsapp_users: number;
  webchat_users: number;
  webapp_users: number;
}

export default function SalesReport({
  className,
  graph,
}: {
  className?: string;
  graph: ReportDataRow[];
}) {
  const isTablet = useMedia('(max-width: 820px)', false);

  const chartData = graph.map((item, index) => ({
    month: `Day ${index + 1}`, // Assuming graph is daily data
    total_tokens: item.total_tokens,
  }));

  return (
    <WidgetCard
      title={'Token Usage'}
      description={
        <>
          <Badge renderAsDot className="me-0.5 bg-[#282ECA]" /> Total Tokens
        </>
      }
      descriptionClassName="text-gray-500 mt-1.5"
      className={className}
    >
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <div className="h-96 w-full pt-9">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '700px' })}
          >
<ComposedChart
  data={chartData}
  barSize={isTablet ? 20 : 24}
  margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
  className="
    [&_.recharts-tooltip-cursor]:fill-opacity-20
    dark:[&_.recharts-tooltip-cursor]:fill-opacity-10
    [&_.recharts-cartesian-axis-tick-value]:fill-gray-500
    [&_.recharts-cartesian-grid-vertical]:opacity-0
  "
>
  <defs>
    <linearGradient id="salesReport" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#F0F1FF" stopOpacity={0.3} />
      <stop offset="95%" stopColor="#8200E9" stopOpacity={0} />
    </linearGradient>
  </defs>

  <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
  <XAxis dataKey="month" axisLine={false} tickLine={false} />
  <YAxis axisLine={false} tickLine={false} tick={<CustomYAxisTick />} />
  <Tooltip content={<CustomTooltip />} />

  <Area
    type="monotone"
    dataKey="total_tokens"
    stroke="#8200E9"
    strokeWidth={2}
    fill="url(#salesReport)"
  />
</ComposedChart>

          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
