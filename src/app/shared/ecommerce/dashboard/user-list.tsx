'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Text, Title, Loader, Badge } from 'rizzui';
import cn from '@core/utils/class-names';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';

type User = {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    tenantCode: string | null;
    tenantName: string | null;
};

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.name}</Text>,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.email}</Text>,
    }),
    columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
            <Badge variant="flat" color={row.original.role === 'SYSTEM_ADMIN' ? 'primary' : 'info'}>
                {row.original.role.replace('_', ' ')}
            </Badge>
        ),
    }),
    columnHelper.accessor('tenantName', {
        header: 'Tenant',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.tenantName || '-'}</Text>,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant="flat"
                color={
                    row.original.status === 'ACTIVE'
                        ? 'success'
                        : row.original.status === 'INACTIVE'
                            ? 'danger'
                            : 'warning'
                }
            >
                {row.original.status}
            </Badge>
        ),
    }),
];

export default function UserList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const [apiData, setApiData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const { table, setData: setTableData } = useTanStackTable<User>({
        tableData: apiData,
        columnConfig: columns,
        options: {
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 10,
                },
            },
            enableColumnResizing: false,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (session?.accessToken) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const response = await fetch(`${apiUrl}/api/v1/admin/users`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setApiData(result);
                        setTableData(result);
                    } else {
                        console.error('Failed to fetch users');
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [session, setTableData]);

    if (loading) {
        return (
            <div className={cn('flex h-64 items-center justify-center', className)}>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <div className={cn('rounded-lg border border-muted bg-gray-0 dark:bg-gray-50', className)}>
            <div className="px-5 py-4">
                <Title as="h3" className="text-base font-semibold sm:text-lg">
                    User List
                </Title>
            </div>
            <Table
                table={table}
                variant="modern"
                classNames={{
                    container: 'border-t border-muted',
                    rowClassName: 'last:border-0',
                }}
            />
        </div>
    );
}
