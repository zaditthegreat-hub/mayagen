'use client';

import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { SubmitHandler, Controller, useForm } from 'react-hook-form';
import { PiClock, PiEnvelopeSimple } from 'react-icons/pi';
import { Loader, Text, Input, Select } from 'rizzui';
import FormGroup from '@/app/shared/form-group';
import FormFooter from '@core/components/form-footer';
import {
  defaultValues,
  personalInfoFormSchema,
  PersonalInfoFormTypes,
} from '@/validators/personal-info.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import { countries, roles, timezones } from '@/data/forms/my-details';
import AvatarUpload from '@core/ui/file-upload/avatar-upload';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
});

export default function PersonalInfoView() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormTypes>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(personalInfoFormSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.accessToken) {
        setIsFetching(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${apiUrl}/api/v1/admin/users/me`, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUserId(userData.id);

            // Split name into first and last name
            const nameParts = (userData.name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            reset({
              first_name: firstName,
              last_name: lastName,
              email: userData.email || '',
              role: userData.role,
              // Map other fields if available in API or keep defaults
              country: undefined,
              timezone: undefined,
              bio: undefined,
              portfolios: undefined,
            });
          } else {
            toast.error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Error loading profile');
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchUserData();
  }, [session, reset]);

  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = async (data) => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const payload = {
        name: `${data.first_name} ${data.last_name || ''}`.trim(),
        email: data.email,
        role: data.role,
        // Add other fields if the API supports them
      };

      const response = await fetch(`${apiUrl}/api/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader variant="spinner" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="@container">
      <FormGroup
        title="Personal Info"
        description="Update your photo and personal details here"
        className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
      />

      <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
        <FormGroup
          title="Name"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Input
            placeholder="First Name"
            {...register('first_name')}
            error={errors.first_name?.message}
            className="flex-grow"
          />
          <Input
            placeholder="Last Name"
            {...register('last_name')}
            error={errors.last_name?.message}
            className="flex-grow"
          />
        </FormGroup>

        <FormGroup
          title="Email Address"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Input
            className="col-span-full"
            prefix={
              <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
            }
            type="email"
            placeholder="georgia.young@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </FormGroup>

        <FormGroup
          title="Your Photo"
          description="This will be displayed on your profile."
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <div className="flex flex-col gap-6 @container @3xl:col-span-2">
            <AvatarUpload
              name="avatar"
              setValue={setValue}
              getValues={getValues}
              error={errors?.avatar?.message as string}
            />
          </div>
        </FormGroup>

        <FormGroup
          title="Role"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Input
            placeholder="Role"
            {...register('role')}
            disabled
            className="col-span-full"
            error={errors.role?.message}
          />
        </FormGroup>

        <FormGroup
          title="Country"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-10 h-auto"
                inPortal={false}
                placeholder="Select Country"
                options={countries}
                onChange={onChange}
                value={value}
                className="col-span-full"
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  countries?.find((con) => con.value === selected)
                    ?.label ?? ''
                }
                error={errors?.country?.message as string}
              />
            )}
          />
        </FormGroup>

        <FormGroup
          title="Timezone"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Controller
            control={control}
            name="timezone"
            render={({ field: { onChange, value } }) => (
              <Select
                dropdownClassName="!z-10 h-auto"
                inPortal={false}
                prefix={<PiClock className="h-6 w-6 text-gray-500" />}
                placeholder="Select Timezone"
                options={timezones}
                onChange={onChange}
                value={value}
                className="col-span-full"
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  timezones?.find((tmz) => tmz.value === selected)
                    ?.label ?? ''
                }
                error={errors?.timezone?.message as string}
              />
            )}
          />
        </FormGroup>

        <FormGroup
          title="Bio"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <QuillEditor
                value={value}
                onChange={onChange}
                className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]"
                labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
              />
            )}
          />
        </FormGroup>

        <FormGroup
          title="Portfolio Projects"
          description="Share a few snippets of your work"
          className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
        >
          <div className="mb-5 @3xl:col-span-2">
            <UploadZone
              name="portfolios"
              getValues={getValues}
              setValue={setValue}
              error={errors?.portfolios?.message as string}
            />
          </div>
        </FormGroup>
      </div>

      <FormFooter
        isLoading={isLoading}
        altBtnText="Cancel"
        submitBtnText="Save"
      />
    </form>
  );
}
