import { useNavigate } from 'react-router-dom';

import { Layout } from '@features/auth/components/Layout';
import RegisterForm from '@features/auth/components/RegisterForm';

export const RegisterRoute = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Register your account">
      <RegisterForm onSuccess={() => navigate('/app')} />
    </Layout>
  );
};