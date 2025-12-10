'use client';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  // Ditambahkan untuk Line Chart
  LineChart, 
  Line, 
  XAxis, 
  LabelList,
  CartesianGrid
} from 'recharts';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import HourGlassIcon from '@core/components/icons/hour-glass';
import WeighingScale from '@core/components/icons/weighing-scale';

const COLORS = {
  newUsers: '#eab308',
  returnUsers: '#10b981',
};

const dataChart = (summary: { newUsers: number; returnUsers: number }) => [
  { name: 'New Users:', value: summary.newUsers, color: COLORS.newUsers },
  { name: 'Return Users:', value: summary.returnUsers, color: COLORS.returnUsers },
];

// Mock Data untuk Line Chart
const lineChartData = [
  { name: 'D1', newUsers: 100, returnUsers: 150 },
  { name: 'D2', newUsers: 120, returnUsers: 170 },
  { name: 'D3', newUsers: 90, returnUsers: 130 },
  { name: 'D4', newUsers: 150, returnUsers: 200 },
  { name: 'D5', newUsers: 110, returnUsers: 160 },
  { name: 'D6', newUsers: 130, returnUsers: 180 },
  { name: 'D7', newUsers: 160, returnUsers: 210 },
];

export default function FleetStatus({
  className,
  summary,
  selection,
}: {
  className?: string;
  summary: {
    newUsers: number;
    returnUsers: number;
    avgResponseTime: number;
    total_tokens: number;
  };
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
          Users
        </Title>
        <div className="mb-6 w-full @3xl:w-40 @4xl:mb-0">
          <div className="mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart className="[&_.recharts-layer:focus]:outline-none [&_.recharts-sector:focus]:outline-none dark:[&_.recharts-text.recharts-label]:first-of-type:fill-white">
                
        {/* === BACKGROUND PIE === */}
        <Pie
          data={[{ value: 100 }]}       // dummy data
          cx="50%"
          cy="50%"
          outerRadius={81}              // sedikit lebih besar dari chart utama
          innerRadius={39}              // sedikit lebih kecil dari innerRadius utama
          fill="#8f8f8f8c"              // background color
          stroke="none"
          paddingAngle={0}
        />

                <Pie
                  data={dataChart(summary)}
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
                  {dataChart(summary).map((item, index) => (
                    <Cell key={index} fill={item.color} stroke={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="">
          {dataChart(summary).map((item, index) => (
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
          <div className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0">
            <div className="flex items-center justify-start">
              <span
                className="me-2 h-2 w-2 rounded-full"
                style={{ backgroundColor: '#6c757d' }}
              />
              <Title as="h5" className="text-sm font-medium">
                Total Users:
              </Title>
            </div>
            <Text as="span">{summary.newUsers + summary.returnUsers}</Text>
          </div>
        </div>
        
        {/* NEW LINE CHART SECTION */}
        <div className="col-span-full mt-6 h-56 w-full @xl:mt-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" /> 
              {/* XAxis ditampilkan untuk label waktu (D1, D2, dst) */}
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              {/* YAxis DIHILANGKAN sesuai permintaan */}

              {/* Garis New Users dengan Label Nilai */}
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke={COLORS.newUsers}
                strokeWidth={2}
                dot={true}
              >
                {/* Menampilkan nilai di atas setiap titik data */}
                <LabelList dataKey="newUsers" position="top" style={{ fontSize: 10, fontWeight: 500 }} />
              </Line>

              {/* Garis Return Users dengan Label Nilai */}
              <Line
                type="monotone"
                dataKey="returnUsers"
                stroke={COLORS.returnUsers}
                strokeWidth={2}
                dot={true}
              >
                {/* Menampilkan nilai di atas setiap titik data */}
                <LabelList dataKey="returnUsers" position="top" style={{ fontSize: 10, fontWeight: 500 }} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* END OF NEW LINE CHART SECTION */}
      </div>
      <div className="grid gap-5 rounded-lg border border-muted p-4 @2xl:grid-cols-2 @2xl:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center">
            <HourGlassIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">  {parseInt(summary.avgResponseTime.toString())}ms</p>
            <p>Avg. Response Time {getPeriod(selection)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-12 w-12 items-center justify-center">
            <WeighingScale className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{summary.total_tokens}</p>
            <p>Token Usage {getPeriod(selection)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}