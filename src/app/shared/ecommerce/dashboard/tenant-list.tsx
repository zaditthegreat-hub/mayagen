'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Text, Title, Loader, ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { PiPencilSimpleBold } from 'react-icons/pi';
import { routes } from '@/config/routes';

type Tenant = {
    id: string;
    name: string;
    email: string;
    code: string;
    address: string | null;
    contact: string | null;
    description: string | null;
    website: string | null;
};

const columnHelper = createColumnHelper<Tenant>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.name}</Text>,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.email}</Text>,
    }),
    columnHelper.accessor('contact', {
        header: 'Contact',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.contact || '-'}</Text>,
    }),
    columnHelper.accessor('website', {
        header: 'Website',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.website || '-'}</Text>,
    }),
    columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.description || '-'}</Text>,
    }),
    columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ row }) => <Text className="font-medium text-gray-700">{row.original.address || '-'}</Text>,
    }),
    columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-3">
                <Link href={routes.tenants.edit(row.original.id)}>
                    <ActionIcon size="sm" variant="outline" aria-label={'Edit Tenant'}>
                        <PiPencilSimpleBold className="h-4 w-4" />
                    </ActionIcon>
                </Link>
            </div>
        ),
    }),
];

export default function TenantList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const [apiData, setApiData] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    const { table, setData: setTableData } = useTanStackTable<Tenant>({
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
                    const response = await fetch(`${apiUrl}/api/v1/admin/tenants`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setApiData(result);
                        setTableData(result);
                    } else {
                        console.error('Failed to fetch tenants');
                    }
                } catch (error) {
                    console.error('Error fetching tenants:', error);
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
                    Tenant List
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
