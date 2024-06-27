import { Layout } from '@features/auth/components/Layout';
import { LoginForm } from '@features/auth/components/LoginForm';

export const LoginRoute = () => {

  return (
    <Layout title="Log in to your account">
      <LoginForm />
    </Layout>
  );
};