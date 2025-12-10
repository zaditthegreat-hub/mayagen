'use client';

import { useState } from 'react';
import WidgetCard from '@core/components/cards/widget-card';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { useMedia } from '@core/hooks/use-media';
import { CustomYAxisTick } from '@core/components/charts/custom-yaxis-tick';
import { CustomTooltip } from '@core/components/charts/custom-tooltip';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import TrendingUpIcon from '@core/components/icons/trending-up';
import DropdownAction from '@core/components/charts/dropdown-action';
import { formatNumber } from '@core/utils/format-number';

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

export default function RevenueExpense({
  className,
  graph,
}: {
  className?: string;
  graph: ReportDataRow[];
}) {
  const isTablet = useMedia('(max-width: 820px)', false);

  const chartData = graph.map((item, index) => ({
    key: `Day ${index + 1}`, // Assuming graph is daily data
    total_messages: item.total_messages,
  }));

  return (
    <WidgetCard
      title="Total Messages"
      description={
        <div className="flex items-center justify-start">
          <Title as="h2" className="me-2 font-semibold">
            {chartData.reduce((acc, item) => acc + item.total_messages, 0)}
          </Title>
        </div>
      }
      descriptionClassName="text-gray-500 mt-1.5"
      className={className}
    >
      <div className="custom-scrollbar overflow-x-auto">
        <div className="h-96 w-full pt-9">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '700px' })}
          >
            <ComposedChart
              data={chartData}
              barSize={isTablet ? 20 : 24}
              className="[&_.recharts-tooltip-cursor]:fill-opacity-20 dark:[&_.recharts-tooltip-cursor]:fill-opacity-10 [&_.recharts-cartesian-axis-tick-value]:fill-gray-500 [&_.recharts-cartesian-axis.yAxis]:-translate-y-3 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            >
              <defs>
                <linearGradient
                  id="colorMessages"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#A5BDEC" />
                  <stop offset="0.8" stopColor="#477DFF" />
                  <stop offset="1" stopColor="#477DFF" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
              <XAxis dataKey="key" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={({ payload, ...rest }) => {
                  const pl = {
                    ...payload,
                    value: formatNumber(Number(payload.value)),
                  };
                  return <CustomYAxisTick payload={pl} {...rest} />;
                }}
              />
              <Tooltip content={<CustomTooltip formattedNumber />} />

              <Bar
                dataKey="total_messages"
                barSize={40}
                fill="url(#colorMessages)"
                stroke="#477DFF"
                strokeOpacity={0.3}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </WidgetCard>
  );
}
