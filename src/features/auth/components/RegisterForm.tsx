// import { Switch } from '@headlessui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button, Input, Text } from '@chakra-ui/react';

import supabase from '@/api/supabase';

const schema = z
  .object({
    email: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  });

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [values, setValues] = useState<RegisterValues>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data using Zod schema
      schema.parse(values);

      // Call supabase API to register the user
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) {
        throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Text>First Name</Text>
        <Input
          type='text'
          name='firstName'
          value={values.firstName}
          onChange={handleChange}
        />
        <Text>Last Name</Text>
        <Input
          type="text"
          name='lastName'
          value={values.lastName}
          onChange={handleChange}
        />
        <Text>Email Address</Text>
        <Input
          type="email"
          name='email'
          value={values.email}
          onChange={handleChange}
        />
        <Text>Password</Text>
        <Input
          type="password"
          name='password'
          value={values.password}
          onChange={handleChange}
        />

        <div>
          <Button type="submit">
            Register
          </Button>
        </div>
      </form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link to="../login" className="font-medium text-blue-600 hover:text-blue-500">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};