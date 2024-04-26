// import { Switch } from '@headlessui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as z from 'zod';

import { Button, Input, Select, Switch, Text } from '@chakra-ui/react';

// import { useTeams } from '@/features/teams';
// import { useAuth } from '@/lib/auth';

const schema = z
  .object({
    email: z.string().min(1, 'Required'),
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, 'Required'),
      })
      .or(z.object({ teamName: z.string().min(1, 'Required') }))
  );

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  // const { register, isRegistering } = useAuth();
  const [register, isRegistering] = React.useState();
  const [chooseTeam, setChooseTeam] = React.useState(false);

  // const teamsQuery = useTeams({
  //   config: {
  //     enabled: chooseTeam,
  //   },
  // });

  return (
    <div>
          <>
            <Text>First Name</Text>
            <Input
              type="text"
            />
            <Text>Last Name</Text>
            <Input
              type="text"
            />
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
                Register
              </Button>
            </div>
          </>
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