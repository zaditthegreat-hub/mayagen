'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Text, Title, Loader, Badge, ActionIcon, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { PiPencilSimpleBold, PiPlusBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Guardrail = {
    id: string;
    code: string;
    name: string;
    description: string;
    direction: string;
    active: boolean;
    rulesJson: any;
};

const columnHelper = createColumnHelper<Guardrail>();

export default function GuardrailList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [apiData, setApiData] = useState<Guardrail[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (session?.accessToken) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/guardrails`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setApiData(result as Guardrail[]);
                } else {
                    console.error('Failed to fetch guardrails');
                }
            } catch (error) {
                console.error('Error fetching guardrails:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this guardrail?')) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/guardrails/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                });

                if (response.ok) {
                    toast.success('Guardrail deleted successfully');
                    fetchData();
                } else {
                    toast.error('Failed to delete guardrail');
                }
            } catch (error) {
                console.error('Error deleting guardrail:', error);
                toast.error('Something went wrong');
            }
        }
    };

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: ({ row }) => (
                <div>
                    <Text className="font-medium text-gray-900">{row.original.name}</Text>
                    <Text className="text-xs text-gray-500">{row.original.code}</Text>
                </div>
            ),
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: ({ row }) => <Text className="text-gray-700 line-clamp-1">{row.original.description}</Text>,
        }),
        columnHelper.accessor('direction', {
            header: 'Direction',
            cell: ({ row }) => (
                <Badge variant="flat" color="info">
                    {row.original.direction}
                </Badge>
            ),
        }),
        columnHelper.accessor('active', {
            header: 'Status',
            cell: ({ row }) => (
                <Badge
                    variant="flat"
                    color={row.original.active ? 'success' : 'danger'}
                >
                    {row.original.active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex items-center justify-end gap-3">
                    <Link href={routes.guardrails.edit(row.original.id)}>
                        <ActionIcon size="sm" variant="outline" aria-label={'Edit Guardrail'}>
                            <PiPencilSimpleBold className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                    <ActionIcon
                        size="sm"
                        variant="outline"
                        color="danger"
                        aria-label={'Delete Guardrail'}
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <PiTrashBold className="h-4 w-4" />
                    </ActionIcon>
                </div>
            ),
        }),
    ];

    const { table, setData: setTableData } = useTanStackTable<Guardrail>({
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
        setTableData(apiData);
    }, [apiData, setTableData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className={cn('flex h-64 items-center justify-center', className)}>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <div className={cn('rounded-lg border border-muted bg-gray-0 dark:bg-gray-50', className)}>
            <div className="flex items-center justify-between px-5 py-4">
                <Title as="h3" className="text-base font-semibold sm:text-lg">
                    Guardrails
                </Title>
                <Link href={routes.guardrails.create}>
                    <Button className="w-full @lg:w-auto">
                        <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                        Create Guardrail
                    </Button>
                </Link>
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
