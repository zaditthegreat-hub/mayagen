'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { Input, Button, Title, Checkbox, Textarea } from 'rizzui';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

export type Profession = {
    id?: string;
    code: string;
    name: string;
    description: string;
    category: string;
    active: boolean;
};

const professionSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    active: z.boolean(),
});

type ProfessionSchema = z.infer<typeof professionSchema>;

export default function CreateEditProfession({ id }: { id?: string }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfessionSchema>({
        defaultValues: {
            code: '',
            name: '',
            description: '',
            category: '',
            active: true,
        },
    });

    useEffect(() => {
        const fetchProfession = async () => {
            if (id && session?.accessToken) {
                setIsFetching(true);
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    const response = await fetch(`${apiUrl}/api/v1/admin/professions/${id}`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        reset({
                            code: result.code,
                            name: result.name,
                            description: result.description,
                            category: result.category,
                            active: result.active,
                        });
                    } else {
                        toast.error('Failed to fetch profession details');
                    }
                } catch (error) {
                    console.error('Error fetching profession:', error);
                    toast.error('Error loading profession');
                } finally {
                    setIsFetching(false);
                }
            } else {
                setIsFetching(false);
            }
        };
        fetchProfession();
    }, [id, session, reset]);

    const onSubmit: SubmitHandler<ProfessionSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!id;
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/professions/${id}`
                : `${apiUrl}/api/v1/admin/professions`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(`Profession ${isEdit ? 'updated' : 'created'} successfully`);
                router.push(routes.professions.dashboard);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || `Failed to ${isEdit ? 'update' : 'create'} profession`);
            }
        } catch (error) {
            console.error('Error saving profession:', error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="@container">
            <div className="mb-6 flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                    {id ? 'Edit Profession' : 'Create New Profession'}
                </Title>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Code"
                        placeholder="e.g. DEV"
                        {...register('code')}
                        error={errors.code?.message}
                        disabled={!!id}
                    />
                    <Input
                        label="Name"
                        placeholder="e.g. Developer"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                </div>

                <Textarea
                    label="Description"
                    placeholder="Profession description..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <Input
                    label="Category"
                    placeholder="e.g. IT"
                    {...register('category')}
                    error={errors.category?.message}
                />

                <Controller
                    name="active"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Checkbox
                            label="Active"
                            checked={value}
                            onChange={onChange}
                        />
                    )}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => router.push(routes.professions.dashboard)}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {id ? 'Update Profession' : 'Create Profession'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
