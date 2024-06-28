import * as React from 'react';

import { Heading, Box } from '@chakra-ui/react';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <Box bg='gray.50'>
      <Heading padding={4} color='#4A5568'>{title}</Heading>
      <Box minHeight='screen' flex='flex' flexDirection='column' justifyContent='center' paddingBlock={12} maxWidth={700}>
        {children}
      </Box>
    </Box>
  );
};