'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Checkbox, Button, Input, Text, Textarea } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { SignUpSchema, signUpSchema } from '@/validators/signup.schema';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const initialValues = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  description: '',
  address: '',
  contact: '',
  website: '',
  isAgreed: false,
};

export default function SignUpForm() {
  const router = useRouter();
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/registerTenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Registration successful! Please login.');
        setReset({ ...initialValues, isAgreed: false });
        router.push(routes.auth.signIn1);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="flex flex-col gap-x-4 gap-y-5 md:grid md:grid-cols-2 lg:gap-5">
            <Input
              type="text"
              size="lg"
              label="Name"
              placeholder="Enter your name"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              type="email"
              size="lg"
              label="Email"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Enter confirm password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('passwordConfirm')}
              error={errors.passwordConfirm?.message}
            />
            <Textarea
              label="Description"
              placeholder="Deskripsikan usaha anda"
              className="col-span-2 [&>label>span]:font-medium"
              textareaClassName="text-sm"
              {...register('description')}
              error={errors.description?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Address"
              placeholder="Enter your address"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('address')}
              error={errors.address?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Contact"
              placeholder="Enter your contact number"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('contact')}
              error={errors.contact?.message}
            />
            <Input
              type="text"
              size="lg"
              label="Website"
              placeholder="Enter your website URL"
              className="col-span-2 [&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('website')}
              error={errors.website?.message}
            />
            <div className="col-span-2 flex items-start">
              <Checkbox
                {...register('isAgreed')}
                className="[&>label>span]:font-medium [&>label]:items-start"
                label={
                  <>
                    By signing up you have agreed to our{' '}
                    <Link
                      href="/"
                      className="font-medium text-blue transition-colors hover:underline"
                    >
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link
                      href="/"
                      className="font-medium text-blue transition-colors hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </>
                }
              />
            </div>
            <Button size="lg" type="submit" className="col-span-2 mt-2">
              <span>Get Started</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5" />
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don’t have an account?{' '}
        <Link
          href={routes.auth.signIn1}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
