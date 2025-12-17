'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { plansListColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import { TableClassNameProps } from '@core/components/table/table-types';
import cn from '@core/utils/class-names';
import { Plan } from '../create-edit-plan';
import { useEffect } from 'react';

export default function PlansTable({
    data = [],
    isLoading = false,
    onDelete,
    className,
}: {
    data: Plan[];
    isLoading?: boolean;
    onDelete: (id: string) => void;
    className?: string;
}) {
    const { table, setData } = useTanStackTable<Plan>({
        tableData: data,
        columnConfig: plansListColumns,
        options: {
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 10,
                },
            },
            meta: {
                handleDeleteRow: (row) => {
                    onDelete(row.id!);
                },
            },
            enableColumnResizing: false,
        },
    });

    // Update table data when prop data changes
    useEffect(() => {
        setData(data);
    }, [data, setData]);

    return (
        <div className={cn('col-span-full', className)}>
            <Table
                table={table}
                variant="modern"
                isLoading={isLoading}
                classNames={{
                    container: 'border border-muted rounded-md',
                    rowClassName: 'last:border-0',
                }}
            />
            <TablePagination
                table={table}
                className="py-4"
            />
        </div>
    );
}
