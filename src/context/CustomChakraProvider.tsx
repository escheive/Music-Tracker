import { ChakraProvider, extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { useAuthContext } from '@/context/AuthProvider';
import { useSupabaseProfile } from '@api/supabase/profile';
import { Text } from '@components/chakra-ui';

type AppProviderProps = {
  children: React.ReactNode;
};

export const CustomChakraProvider = ({children}: AppProviderProps) => {
  const { session } = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);

  const theme = extendTheme(
    withDefaultColorScheme({ colorScheme: `${profile?.theme}` || 'cyan' }),
    {
      styles: {
        global: {
          // styles for the `body`
          body: {
            bg: '#f9f9f9',
            color: '#4a4a4a'
          },
        },
      },
      components: {
        Container: {
          baseStyle: {
            _focus: { boxShadow: 'none' },
          },
          variants: {
            post: (props: { colorMode: string; }) => ({
              bg: props.colorMode === 'dark' ? `${profile?.theme}.200` : `${profile?.theme}.100`,
              margin: 0,
              maxWidth: '100%',
              py: 4,
              px: 8
            }),
          },
        },
        Button: {
          baseStyle: {
            _focus: { boxShadow: 'none' },
          },
          variants: {
            solid: (props: { colorMode: string; colorScheme: any; }) => ({
              bg: profile?.theme ? props.colorMode === 'dark' ? `${profile?.theme}.300` : `${profile?.theme}.300` : props.colorScheme,
              _hover: {
                bg: props.colorMode === 'dark' ? `${profile?.theme}.200` : `${profile?.theme}.400`,
              },
            }),
            outline: (props: { colorMode: string; }) => ({
              bg: 'transparent',
              _hover: {
                bg: props.colorMode === 'dark' ? `${profile?.theme}.50` : `${profile?.theme}.300`,
              },
            }),
          },
        },
        Modal: {
          baseStyle: {
            overlay: {
              bg: `${profile?.theme}.50` + 'CC',
              backdropFilter: 'blur(2px) opacity(0.2)',
            }
          }
        },
        Table: {
          defaultProps: {
            colorScheme: `${profile?.theme}`,
          },
          baseStyle: {
            _focus: { boxShadow: 'none' },
          },
        },
        Text,
      },
      colors: {
        alternatePurple: {
          50: '#ffe5fe',
          100: '#f8b5fd',
          200: '#ee84f9',
          300: '#e254f7',
          400: '#d226f5',
          500: '#b112dc',
          600: '#850cab',
          700: '#5b077a',
          800: '#35024a',
          900: '#16001c',
        }
      },
  })

  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )

}