'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Grid } from 'rizzui/grid';
import { Text, Title, Loader, ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiPlusBold, PiTrashBold, PiPencilSimpleBold } from 'react-icons/pi';
import { Persona } from './create-edit-persona';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

export default function PersonaList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPersonas = useCallback(async () => {
        if (session?.accessToken) {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/persona-templates`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setPersonas(result);
                } else {
                    console.error('Failed to fetch personas');
                }
            } catch (error) {
                console.error('Error fetching personas:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [session]);

    useEffect(() => {
        fetchPersonas();
    }, [fetchPersonas]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this persona?')) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/persona-templates/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                });

                if (response.ok) {
                    toast.success('Persona deleted successfully');
                    fetchPersonas();
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || 'Failed to delete persona');
                }
            } catch (error) {
                console.error('Error deleting persona:', error);
                toast.error('Something went wrong');
            }
        }
    };

    if (loading && personas.length === 0) {
        return (
            <div className={cn('flex h-64 items-center justify-center', className)}>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <Box className={cn('col-span-full @container', className)}>
            <Flex justify="between" align="center" className="mb-3 2xl:mb-5">
                <Title as="h3" className="text-lg font-semibold xl:text-xl">
                    Persona Templates
                </Title>
                <Link href={routes.personaTemplates.create}>
                    <Button className="mt-0">
                        <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                        Create Persona
                    </Button>
                </Link>
            </Flex>
            <Grid className="grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
                {personas.map((persona) => (
                    <PersonaItem
                        key={persona.id}
                        persona={persona}
                        onEdit={() => router.push(routes.personaTemplates.edit(persona.id!))}
                        onDelete={() => handleDelete(persona.id!)}
                    />
                ))}
            </Grid>
        </Box>
    );
}

function PersonaItem({
    persona,
    className,
    onEdit,
    onDelete,
}: {
    persona: Persona;
    className?: string;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <Flex
            direction="col"
            gap="2"
            className={cn(
                'rounded-xl border border-muted bg-white p-3 dark:bg-gray-50',
                className
            )}
        >
            <Box className="relative aspect-[309/200] w-full bg-gray-100 rounded-[10px] overflow-hidden">
                {/* Placeholder image since API doesn't provide one */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span className="text-4xl font-bold">{persona.code}</span>
                </div>
            </Box>
            <Flex direction="col" gap="2" className="mt-2 grow px-3">
                <Flex justify="between" align="center">
                    <Text
                        as="span"
                        className="block text-xs font-semibold uppercase text-primary"
                    >
                        {persona.professionName || persona.professionCode}
                    </Text>
                    {persona.active && (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            Active
                        </span>
                    )}
                </Flex>
                <Title as="h6" className="block text-base font-medium text-gray-900">
                    {persona.name}
                </Title>
                <Text className="text-sm text-gray-500 line-clamp-2">
                    {persona.description || 'No description'}
                </Text>
                <Flex align="end" justify="between" className="mt-auto flex-wrap">
                    <Flex direction="col" className="w-auto gap-y-2">
                        <Text as="span" className="text-xs text-gray-500">
                            Voice: {persona.defaultVoice}
                        </Text>
                    </Flex>
                    <div className="flex gap-2">
                        <ActionIcon
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                            className="hover:!border-gray-900 hover:text-gray-700"
                        >
                            <PiPencilSimpleBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                            size="sm"
                            variant="outline"
                            color="danger"
                            onClick={onDelete}
                            className="hover:!border-red-600 hover:text-red-600"
                        >
                            <PiTrashBold className="h-4 w-4" />
                        </ActionIcon>
                    </div>
                </Flex>
            </Flex>
        </Flex>
    );
}
