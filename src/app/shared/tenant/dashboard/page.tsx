'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';

import FeaturedBid from '@/app/shared/project-dashboard/overall-progress';
import AppointmentTodo from '../cs/appointment-todo';
// import { useSelectedOption } from '@/hooks/use-selected-option';

import WelcomeBanner from './welcome-banner';
import PlatformAccess from './platform-access';
import FleetStatus from './fleet-status';
import BudgetStatus from '@/app/shared/financial/dashboard/budget-status';

import { getReport1d, getReport7d, getReport30d } from '@/api';

/* ------------ TYPE DEFINITIONS ------------- */
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

interface UniversalSummary {
    total_users: number;
    new_users: number;
    return_users: number;
    total_messages: number;
    total_tokens: number;
    avg_response_time: number;
    platform_usage: {
        visual_chat: number;
        whatsapp: number;
        webchat: number;
        webapp: number;
    };
    graph: ReportDataRow[];
}

/* ------------ SUMMARY ADAPTER ------------- */
function buildUniversalSummary(data: ReportDataRow[] = []) {
    return data.reduce(
        (acc, row) => {
            acc.total_users += Number(row.unique_users ?? 0);
            acc.new_users += Number(row.new_users ?? 0);
            acc.return_users += Number(row.returning_users ?? 0);

            acc.total_messages += Number(row.total_messages ?? 0);
            acc.total_tokens += Number(row.total_tokens ?? 0);

            acc.response_times.push(Number(row.avg_response_time ?? 0));

            acc.platform_usage.visual_chat += Number(0);
            acc.platform_usage.whatsapp += Number(row.whatsapp_users ?? 0);
            acc.platform_usage.webchat += Number(row.webchat_users ?? 0);
            acc.platform_usage.webapp += Number(row.webapp_users ?? 0);

            return acc;
        },
        {
            total_users: 0,
            new_users: 0,
            return_users: 0,
            total_messages: 0,
            total_tokens: 0,
            response_times: [] as number[],
            platform_usage: {
                visual_chat: 0,
                whatsapp: 0,
                webchat: 0,
                webapp: 0,
            },
        }
    );
}

function extractSummary(data: ReportDataRow[] = []): UniversalSummary {
    const summary = buildUniversalSummary(data);

    return {
        total_users: summary.total_users,
        new_users: summary.new_users,
        return_users: summary.return_users,
        total_messages: summary.total_messages,
        total_tokens: summary.total_tokens,

        avg_response_time:
            summary.response_times.length === 0
                ? 0
                : summary.response_times.reduce((a, b) => a + b, 0) /
                summary.response_times.length,

        platform_usage: summary.platform_usage,
        graph: data,
    };
}

/* ------------ MAIN COMPONENT ------------- */
export default function BiddingDashboard() {
    const { tenantId } = useParams();
    // const { selectedOption } = useSelectedOption();
    const { selectedOption } = { selectedOption: '1d' };


    const [report1d, setReport1d] = useState<ReportDataRow[] | null>(null);
    const [report7d, setReport7d] = useState<ReportDataRow[] | null>(null);
    const [report30d, setReport30d] = useState<ReportDataRow[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (selectedOption === '1d' && !report1d) {
                    setReport1d(await getReport1d(tenantId));
                }
                if (selectedOption === '7d' && !report7d) {
                    setReport7d(await getReport7d(tenantId));
                }
                if (selectedOption === '30d' && !report30d) {
                    setReport30d(await getReport30d(tenantId));
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }

        fetchData();
    }, [selectedOption, tenantId, report1d, report7d, report30d]);

    /* -----------------------------------------
       GLOBAL DATA — hanya 1 summary dipakai
    ------------------------------------------ */
    const activeReport =
        (selectedOption === '1d' && report1d) ||
        (selectedOption === '7d' && report7d) ||
        (selectedOption === '30d' && report30d) ||
        null;

    const summary = useMemo(
        () => (activeReport ? extractSummary(activeReport) : null),
        [activeReport]
    );

    return (
        <div className="grid grid-cols-1 gap-6 @container lg:grid-cols-12">

            <div className="col-span-full flex flex-col gap-6 @5xl:col-span-8 3xl:col-span-9">
                <WelcomeBanner />

                {/* Summary Card 1 & 2 */}
                <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4 items-stretch">
                    <PlatformAccess
                        className="w-full h-full justify-between"
                        selection={selectedOption}
                        data={summary?.platform_usage || { visual_chat: 0, whatsapp: 0, webchat: 0, webapp: 0 }}
                        summary={{
                            usersToday: summary?.total_users || 0,
                            messagesToday: summary?.total_messages || 0,
                        }}
                    />

                    <FleetStatus
                        selection={selectedOption}
                        summary={{
                            newUsers: summary?.new_users || 0,
                            returnUsers: summary?.return_users || 0,
                            avgResponseTime: summary?.avg_response_time || 0,
                            total_tokens: summary?.total_tokens || 0,
                        }}
                        className="w-full h-full justify-between"
                    />
                </div>

                {/* Graph Components — tetap sama */}
                {/* <SalesReport
                    graph={summary?.graph || []}
                    className="@4xl:col-span-2 @7xl:col-span-7"
                />
                <RevenueExpense
                    graph={summary?.graph || []}
                    className="@3xl/jd:col-span-full @5xl:col-span-7"
                />
                <ResponseRate
                    graph={summary?.graph || []}
                    className="col-span-full @4xl:col-span-6 @6xl:col-span-7"
                /> */}
            </div>

            <div className="col-span-full @container/sidebar @5xl:col-span-4 3xl:col-span-3">
                <div className="grid grid-cols-1 gap-6 @2xl/sidebar:grid-cols-2">
                    {/* <FeaturedBid className="order-1" /> */}
                    {/* <AppointmentTodo className="order-2 @2xl/sidebar:order-3" /> */}
                    <BudgetStatus className="col-span-full @[59rem]:col-span-3 @[90rem]:col-span-2" />
                </div>
            </div>
        </div>
    );
}
