'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Box } from 'rizzui/box';
import { Button } from 'rizzui/button';
import { Flex } from 'rizzui/flex';
import { Grid } from 'rizzui/grid';
import { Text, Title, Loader, Modal, ActionIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiPlusBold, PiTrashBold, PiPencilSimpleBold } from 'react-icons/pi';
import CreateEditProfession, { Profession } from './create-edit-profession';
import toast from 'react-hot-toast';

export default function ProfessionList({ className }: { className?: string }) {
    const { data: session } = useSession();
    const [professions, setProfessions] = useState<Profession[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState(false);
    const [selectedProfession, setSelectedProfession] = useState<Profession | undefined>(undefined);

    const fetchProfessions = async () => {
        if (session?.accessToken) {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/professions`, {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setProfessions(result);
                } else {
                    console.error('Failed to fetch professions');
                }
            } catch (error) {
                console.error('Error fetching professions:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchProfessions();
    }, [session]);

    const handleCreate = () => {
        setSelectedProfession(undefined);
        setModalState(true);
    };

    const handleEdit = (profession: Profession) => {
        setSelectedProfession(profession);
        setModalState(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this profession?')) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const response = await fetch(`${apiUrl}/api/v1/admin/professions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                });

                if (response.ok) {
                    toast.success('Profession deleted successfully');
                    fetchProfessions();
                } else {
                    const errorData = await response.json();
                    toast.error(errorData.message || 'Failed to delete profession');
                }
            } catch (error) {
                console.error('Error deleting profession:', error);
                toast.error('Something went wrong');
            }
        }
    };

    if (loading && professions.length === 0) {
        return (
            <div className={cn('flex h-64 items-center justify-center', className)}>
                <Loader variant="spinner" />
            </div>
        );
    }

    return (
        <>
            <Box className={cn('col-span-full @container', className)}>
                <Flex justify="between" align="center" className="mb-3 2xl:mb-5">
                    <Title as="h3" className="text-lg font-semibold xl:text-xl">
                        Professions
                    </Title>
                    <Button onClick={handleCreate} className="mt-0">
                        <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
                        Create Profession
                    </Button>
                </Flex>
                <Grid className="grid-cols-1 gap-6 @xl:grid-cols-2 @4xl:grid-cols-3">
                    {professions.map((profession) => (
                        <ProfessionItem
                            key={profession.id}
                            profession={profession}
                            onEdit={() => handleEdit(profession)}
                            onDelete={() => handleDelete(profession.id!)}
                        />
                    ))}
                </Grid>
            </Box>

            <Modal isOpen={modalState} onClose={() => setModalState(false)}>
                <CreateEditProfession
                    profession={selectedProfession}
                    closeModal={() => setModalState(false)}
                    onSuccess={fetchProfessions}
                />
            </Modal>
        </>
    );
}

function ProfessionItem({
    profession,
    className,
    onEdit,
    onDelete,
}: {
    profession: Profession;
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
                    <span className="text-4xl font-bold">{profession.code}</span>
                </div>
            </Box>
            <Flex direction="col" gap="2" className="mt-2 grow px-3">
                <Text
                    as="span"
                    className="block text-xs font-semibold uppercase text-primary"
                >
                    {profession.category}
                </Text>
                <Title as="h6" className="block text-base font-medium text-gray-900">
                    {profession.name}
                </Title>
                <Text className="text-sm text-gray-500 line-clamp-2">
                    {profession.description || 'No description'}
                </Text>
                <Flex align="end" justify="between" className="mt-auto flex-wrap">
                    <Flex direction="col" className="w-auto gap-y-2">
                        {/* Add any other details here if needed */}
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
