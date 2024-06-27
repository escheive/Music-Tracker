import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button, Text, Input } from '@chakra-ui/react';
import { useState } from 'react';

import supabase from '@/api/supabase';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

type LoginValues = {
  email: string;
  password: string;
};


export const LoginForm = () => {
  const [values, setValues] = useState<LoginValues>({
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
      const { data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (!data.session) {
        console.log('Invalid email or password')
      }

      if (data.session) {

      }
    } catch (error: any) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Text>Email Address</Text>
        <Input
          type="email"
          name='email'
          value={values.email}
          onChange={handleChange}
        />
        <Text>Password</Text>
        <Input
          type='password'
          name='password'
          value={values.password}
          onChange={handleChange}
        />
        <div>
          <Button type="submit">Log in</Button>
        </div>
      </form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};