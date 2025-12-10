'use client';

import { Box, Text, AdvancedCheckbox, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import WidgetCard from '@core/components/cards/widget-card';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PiCheckBold } from 'react-icons/pi';
import DropdownAction from '@core/components/charts/dropdown-action';

// 1. Data untuk Knowledge Base Utilization Gauge
const kbUtilizationData = [
  { name: 'Used', percentage: 85, count: '85%', color: '#0375EE' }, // Warna primer untuk 'Used'
  { name: 'Gap', percentage: 15, count: '15%', color: '#D1E6FF' }, // Warna sekunder/abu-abu untuk 'Gap'
];

// 4. Data Top 5 Unanswered (Simulasi Data)
const topUnansweredData = [
  { topic: 'Kebijakan Pengembalian Produk Baru', count: 124 },
  { topic: 'Perbedaan Fitur Paket Premium vs Basic', count: 98 },
  { topic: 'Integrasi API dengan Sistem Pihak Ketiga', count: 75 },
  { topic: 'Cara Mengganti Metode Pembayaran', count: 52 },
  { topic: 'Langkah-langkah Reset Password Admin', count: 41 },
];

const viewOptions = [
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'quarterly', label: 'Triwulan' },
];

function handleChange(viewType: string) {
  console.log('viewType', viewType);
}

export default function KnowledgeWhisperer({ className }: { className?: string }) {
  return (
    <WidgetCard
      title="Knowledge Base Analytics"
      headerClassName="items-center"
      className={cn('@container dark:bg-gray-100/50', className)}
    >
      {/* --- Knowledge Base Utilization Rate Gauge --- */}
      <Box className="relative h-60 w-full translate-y-6 @sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            margin={{ top: 40, right: 10 }}
            className="relative focus:[&_.recharts-sector]:outline-none"
          >
            <Pie
              label
              data={kbUtilizationData}
              dataKey="percentage"
              startAngle={200}
              endAngle={-20}
              paddingAngle={1}
              cornerRadius={12}
              innerRadius="85%"
              outerRadius="100%"
              stroke="none"
            >
              {kbUtilizationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Score Tengah */}
        <Box className="absolute bottom-20 start-1/2 -translate-x-1/2 text-center @sm:bottom-28">
          <Text className="text-2xl font-bold text-gray-800 @lg:text-4xl">
            85%
          </Text>
          <Text className="font-medium">KB Covered</Text>
        </Box>
      </Box>

      {/* --- BAWAH: Knowledge Gap (Top 5 Unanswered) --- */}
      <Box className="mt-8">
        <Text className="mb-4 text-base font-semibold text-gray-800">
          Knowledge Gap (Top 5 Unanswered)
        </Text>
        
        <div className="relative h-64 overflow-hidden">
          <div className="custom-scrollbar relative -mx-3 -my-2 h-full w-[calc(100%+24px)] overflow-y-auto pb-6">
            <div className="relative before:absolute before:start-4 before:top-2 before:z-0 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gray-200">
              {topUnansweredData.map((item, index) => (
                <AdvancedCheckbox
                  name="topic"
                  value={item.topic}
                  key={index}
                  className="relative z-10 mt-0.5 px-3 py-1.5"
                  inputClassName="[&:checked~.rizzui-advanced-checkbox]:ring-muted [&:checked~.rizzui-advanced-checkbox>span>svg]:opacity-100 [&:checked~.rizzui-advanced-checkbox>span]:border-[#2B7F75] [&:checked~.rizzui-advanced-checkbox>div>div>strong]:line-through [&:checked~.rizzui-advanced-checkbox>div>div>strong]:text-gray-500 [&:checked~.rizzui-advanced-checkbox>div>div>strong+span]:line-through"
                  contentClassName="flex w-full bg-gray-50 dark:bg-gray-0 items-center @md:px-5 px-4 py-3 rounded-lg hover:shadow transition-shadow border border-gray-100 @md:gap-5 gap-4"
                >
                  {/* Icon Bulat di Awal untuk Penanda */}
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#0375EE] bg-white">
                    <PiCheckBold className="fill-[#0375EE] h-3 w-3 opacity-0" />
                  </span>
                  
                  <div className="block">
                    <div className="text-gray-600">
                      <strong className="font-semibold text-gray-900">
                        {item.topic}
                      </strong>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-normal text-sm text-gray-500">
                        {item.count} permintaan
                      </span>
                    </div>
                  </div>
                </AdvancedCheckbox>
              ))}
            </div>
          </div>
          
          {/* Fading Bottom Button */}
          <div className="absolute -start-0.5 bottom-0 z-20 flex h-16 w-[101%] items-end justify-center bg-gradient-to-t from-white via-white to-transparent dark:from-gray-50 dark:via-gray-50">
            <Button
              rounded="lg"
              variant="flat"
              className="bg-gray-100 text-gray-800 shadow-sm transition-shadow hover:bg-gray-200 dark:bg-gray-100 dark:hover:bg-gray-200"
            >
              Lihat Semua
            </Button>
          </div>
        </div>
      </Box>
    </WidgetCard>
  );
}