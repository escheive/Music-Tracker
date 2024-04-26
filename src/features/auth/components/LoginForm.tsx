import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button, Text, Input } from '@chakra-ui/react';
import { useState } from 'react';
// import { useAuth } from '@/lib/auth';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  // const { login, isLoggingIn } = useAuth();
  const [login, isLoggingIn ] = useState();

  return (
    <div>
          <>
            <Text>Email Address</Text>
            <Input
              type="email"
            />
            <Text>Password</Text>
            <Input
              type="password"
            />
            <div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </div>
          </>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link to="../register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};