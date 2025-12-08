'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Input, Button, ActionIcon, Title, Text, Checkbox, Textarea } from 'rizzui';
import { PiXBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Define the profession type based on the API response
export type Profession = {
    id?: string;
    code: string;
    name: string;
    description: string | null;
    category: string;
    active: boolean;
};

// Zod schema for validation
const professionSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    active: z.boolean(),
});

type ProfessionSchema = z.infer<typeof professionSchema>;

export default function CreateEditProfession({
    profession,
    closeModal,
    onSuccess,
}: {
    profession?: Profession;
    closeModal: () => void;
    onSuccess: () => void;
}) {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const initialValues: ProfessionSchema = {
        code: profession?.code || '',
        name: profession?.name || '',
        description: profession?.description || '',
        category: profession?.category || '',
        active: profession?.active ?? true,
    };

    const onSubmit: SubmitHandler<ProfessionSchema> = async (data) => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const isEdit = !!profession?.id;
            const url = isEdit
                ? `${apiUrl}/api/v1/admin/professions/${profession.id}`
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
                onSuccess();
                closeModal();
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

    return (
        <div className="m-auto px-5 pb-8 pt-5 @lg:pt-6 @2xl:px-7">
            <div className="mb-7 flex items-center justify-between">
                <Title as="h4" className="font-semibold">
                    {profession ? 'Edit Profession' : 'Create New Profession'}
                </Title>
                <ActionIcon size="sm" variant="text" onClick={closeModal}>
                    <PiXBold className="h-auto w-5" />
                </ActionIcon>
            </div>

            <Form<ProfessionSchema>
                validationSchema={professionSchema}
                onSubmit={onSubmit}
                useFormProps={{
                    defaultValues: initialValues,
                }}
            >
                {({ register, control, formState: { errors } }) => (
                    <div className="flex flex-col gap-y-4">
                        <Input
                            label="Code"
                            placeholder="e.g. CS"
                            {...register('code')}
                            error={errors.code?.message}
                            disabled={!!profession} // Code is usually immutable or unique identifier
                        />
                        <Input
                            label="Name"
                            placeholder="e.g. Customer Service"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Category"
                            placeholder="e.g. Layanan"
                            {...register('category')}
                            error={errors.category?.message}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Profession description..."
                            {...register('description')}
                            error={errors.description?.message}
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

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                                {profession ? 'Update Profession' : 'Create Profession'}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}
