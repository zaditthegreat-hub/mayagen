'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Plan } from '../create-edit-plan';
import { Text, Badge, Tooltip, ActionIcon, Flex } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import Link from 'next/link';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import DeletePopover from '@core/components/delete-popover';
import { PiTrashBold } from 'react-icons/pi';

const columnHelper = createColumnHelper<Plan>();

export const plansListColumns = [
    columnHelper.accessor('code', {
        id: 'code',
        size: 100,
        header: 'Code',
        cell: ({ row }) => (
            <Text className="font-medium text-gray-900">{row.original.code}</Text>
        ),
    }),
    columnHelper.accessor('name', {
        id: 'name',
        size: 200,
        header: 'Name',
        cell: ({ row }) => (
            <Text className="font-medium text-gray-900">{row.original.name}</Text>
        ),
    }),
    columnHelper.accessor('description', {
        id: 'description',
        size: 300,
        header: 'Description',
        cell: ({ row }) => (
            <Text className="truncate text-gray-500">{row.original.description}</Text>
        ),
    }),
    columnHelper.accessor('billingCycle', {
        id: 'billingCycle',
        size: 150,
        header: 'Billing Cycle',
        cell: ({ row }) => (
            <Badge variant="flat" color="info" className="rounded-md">
                {row.original.billingCycle}
            </Badge>
        ),
    }),
    columnHelper.accessor('priceCents', {
        id: 'price',
        size: 150,
        header: 'Price',
        cell: ({ row }) => (
            <Text className="font-medium text-gray-900">
                {toCurrency(row.original.priceCents / 100, true)} {row.original.currency}
            </Text>
        ),
    }),
    columnHelper.accessor('active', {
        id: 'active',
        size: 100,
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant="flat"
                color={row.original.active ? 'success' : 'danger'}
                className="rounded-md"
            >
                {row.original.active ? 'Active' : 'Inactive'}
            </Badge>
        ),
    }),
    columnHelper.display({
        id: 'action',
        size: 100,
        cell: ({
            row,
            table: {
                options: { meta },
            },
        }) => (
            <Flex align="center" justify="end" gap="3" className="pe-4">
                <Tooltip
                    size="sm"
                    content={'Edit Plan'}
                    placement="top"
                    color="invert"
                >
                    <Link href={routes.plans.edit(row.original.code)}>
                        <ActionIcon
                            as="span"
                            size="sm"
                            variant="outline"
                            aria-label={'Edit Plan'}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </ActionIcon>
                    </Link>
                </Tooltip>
                <DeletePopover
                    title={`Delete the plan`}
                    description={`Are you sure you want to delete this plan?`}
                    onDelete={() =>
                        meta?.handleDeleteRow && meta?.handleDeleteRow(row.original)
                    }
                />
            </Flex>
        ),
    }),
];
