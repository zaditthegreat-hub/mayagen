'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  CartesianGrid,
  LabelList, // Pastikan LabelList diimpor
} from 'recharts';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import HourGlassIcon from '@core/components/icons/hour-glass';
import WeighingScale from '@core/components/icons/weighing-scale';

const COLORS = {
  visual_chat: '#9d10b9ff',
  whatsapp: '#3872FA',
  webchat: '#eab308',
  webapp: '#10b981',
};

const dataChart = (data: {
  visual_chat: number;
  whatsapp: number;
  webchat: number;
  webapp: number;
}) => [
    { name: 'Visual Chat:', value: data?.visual_chat, color: COLORS.visual_chat },
    { name: 'Whatsapp:', value: data?.whatsapp, color: COLORS.whatsapp },
    { name: 'Web Chat:', value: data?.webchat, color: COLORS.webchat },
    { name: 'Web App:', value: data?.webapp, color: COLORS.webapp },
  ];

// MOCK DATA for the Line Chart (Time-series data is needed)
const lineChartData = [
  { name: 'Day 1', visual_chat: 4000, whatsapp: 2400, webchat: 2400, webapp: 2000 },
  { name: 'Day 2', visual_chat: 3000, whatsapp: 1398, webchat: 2210, webapp: 2500 },
  { name: 'Day 3', visual_chat: 2000, whatsapp: 9800, webchat: 2290, webapp: 1500 },
  { name: 'Day 4', visual_chat: 2780, whatsapp: 3908, webchat: 2000, webapp: 3000 },
  { name: 'Day 5', visual_chat: 1890, whatsapp: 4800, webchat: 2181, webapp: 1000 },
  { name: 'Day 6', visual_chat: 2390, whatsapp: 3800, webchat: 2500, webapp: 3500 },
  { name: 'Day 7', visual_chat: 3490, whatsapp: 4300, webchat: 2100, webapp: 4000 },
];

// --- KOMPONEN LABEL KUSTOM UNTUK MENGHINDARI OVERLAP ---
const CustomLineLabel = (props: any) => {
  const { x, y, value, dataKey, data } = props;

  // Dapatkan semua nilai untuk dataKey saat ini
  const values = data.map((item: any) => item[dataKey]);

  // Cari nilai maksimum dan minimum global
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  // Cari index titik saat ini
  const currentIndex = data.findIndex((item: any) => item[dataKey] === value && item.name === props.name);

  // LOGIKA TAMPILKAN LABEL:
  // Tampilkan label hanya jika titik ini adalah:
  // 1. Titik tertinggi (maksimum global)
  // 2. Titik terendah (minimum global)
  // 3. Titik awal (indeks 0)
  // 4. Titik akhir (indeks terakhir)
  const isImportantPoint =
    value === maxVal ||
    value === minVal ||
    currentIndex === 0 ||
    currentIndex === data.length - 1;

  if (isImportantPoint) {
    return (
      <text
        x={x}
        y={y}
        dy={value === maxVal ? -10 : 15} // Posisikan di atas maks, di bawah min
        fill={props.stroke} // Gunakan warna stroke garis
        fontSize={10}
        fontWeight={600}
        textAnchor="middle"
      >
        {value}
      </text>
    );
  }
  return null;
};
// -----------------------------------------------------------------

export default function PlatformAccess({
  className,
  data,
  summary,
  selection,
}: {
  className?: string;
  data: { visual_chat: number; whatsapp: number; webchat: number; webapp: number };
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

                {/* === BACKGROUND PIE === */}
                <Pie
                  data={[{ value: 100 }]}
                  cx="50%"
                  cy="50%"
                  outerRadius={81}
                  innerRadius={39}
                  fill="#8f8f8f8c"
                  stroke="none"
                  paddingAngle={0}
                />

                {/* === MAIN PIE === */}
                <Pie
                  data={dataChart(data)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={8}
                  strokeWidth={2}
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
        <div className="">
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
        {/* LINE CHART SECTION DENGAN CUSTOM LABELS */}
        {/* AREA CHART SECTION (Replaced from LineChart) */}
        <div className="col-span-full mt-6 h-64 w-full @xl:mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lineChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >

              <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.5} vertical={false} />

              <XAxis dataKey="name" />

              <Tooltip
                contentStyle={{
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              />

              {/* MULTI-LINE AREA + LABELS */}
              {[
                'visual_chat',
                'whatsapp',
                'webchat',
                'webapp'
              ].map((key) => (
                <Area
  key={key}
  type="monotone"
  dataKey={key}
  stroke={COLORS[key]}
  strokeWidth={2.3}
  fillOpacity={1}
  fill={`url(#gradient-${key})`}
  dot={{ r: 3 }}
>
  <LabelList
    dataKey={key}
    position="top"   // memastikan label selalu di atas line
    layer="top"      // menggambar label pada layer paling depan
    content={
      <CustomLineLabel
        dataKey={key}
        data={lineChartData}
        stroke={COLORS[key]}
      />
    }
  />
</Area>

              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* END OF LINE CHART SECTION */}
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