'use client';

import WidgetCard from '@core/components/cards/widget-card';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { useMedia } from '@core/hooks/use-media';
import { DatePicker } from '@core/ui/datepicker';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

export default function ResponseRate({
  className,
  graph,
}: {
  className?: string;
  graph: ReportDataRow[];
}) {
  const isTablet = useMedia('(max-width: 820px)', false);

  const chartData = graph.map((item, index) => ({
    month: `Day ${index + 1}`, // Assuming graph is daily data
    avg_response_time: Number(item.avg_response_time),
  }));

  return (
    <WidgetCard
      title="Average Response Time"
      className={className}
      description={
        <>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-3 w-3 rounded-[2px] bg-[#10b981]" />
            Average Response Time
          </span>
        </>
      }
      descriptionClassName="text-gray-500 mt-1.5 flex flex-col md:flex-row items-center gap-2"
    >
      <div className="custom-scrollbar overflow-x-auto scroll-smooth">
        <div className="h-96 w-full pt-9">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '700px' })}
          >
            <AreaChart
              data={chartData}
              margin={{
                left: -5,
                right: 5,
                bottom: 10,
              }}
              className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            >
              <defs>
                <linearGradient id="avgResponseTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3872FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={20}
                unit="mins"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="natural"
                dataKey="avg_response_time"
                stroke="#3872FA"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#avgResponseTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
