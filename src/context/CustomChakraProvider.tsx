import { ChakraProvider, Spinner, extendTheme, theme as defaultTheme, useTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { AuthProvider, useAuthContext } from '@/context/AuthProvider';
import { useSupabaseProfile } from '@api/supabase/fetch';
import { useEffect, useState, useMemo } from 'react';
import { Button, Text } from '@components/chakra-ui';
import { modalAnatomy as modalParts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

type AppProviderProps = {
  children: React.ReactNode;
};

export const CustomChakraProvider = ({children}: AppProviderProps) => {
  const { session } = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  console.log(defaultTheme)
  console.log(profile?.theme)

  const withOpacity = (color, value, opacity) => {
    return defaultTheme.colors[color][value] + opacity;
  }


  const theme = extendTheme(
    withDefaultColorScheme({ colorScheme: `${profile?.theme}` || 'cyan' }),
    {
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
          // defaultProps: {
          //   colorScheme: `${profile?.theme}`,
          // },
          baseStyle: {
            _focus: { boxShadow: 'none' },
          },
          variants: {
            post: (props) => ({
              bg: props.colorMode === 'dark' ? `${profile?.theme}.200` : `${profile?.theme}.100`,
            }),
          },
        },
        Button: {
          baseStyle: {
            _focus: { boxShadow: 'none' },
          },
          variants: {
            solid: (props) => ({
              bg: props.colorMode === 'dark' ? `${profile?.theme}.300` : `${profile?.theme}.300`,
              _hover: {
                bg: props.colorMode === 'dark' ? `${profile?.theme}.200` : `${profile?.theme}.400`,
              },
            }),
            outline: (props) => ({
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
              bg: withOpacity(`${profile?.theme || 'gray'}`, '50', 'CC'),
              // backgroundColor: `${profile?.theme}`,
              backdropFilter: 'blur(2px) opacity(0.2)',
              // backdropFilter='blur(10px) hue-rotate(90deg)',
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
          // variants: {
          //   solid: (props) => ({
          //     bg: props.colorMode === 'dark' ? `${profile?.theme}.500` : `${profile?.theme}.600`,
          //     _hover: {
          //       bg: props.colorMode === 'dark' ? `${profile?.theme}.400` : `${profile?.theme}.700`,
          //     },
          //   }),
          // },
        },
        Text,
      },
  })

  // const getChakraTheme = (colorScheme) => {
  //   return extendTheme({
  //     colors: {
  //       ...defaultTheme.colors,
  //       alternatePurple: {
  //         50: '#ffe5fe',
  //         100: '#f8b5fd',
  //         200: '#ee84f9',
  //         300: '#e254f7',
  //         400: '#d226f5',
  //         500: '#b112dc',
  //         600: '#850cab',
  //         700: '#5b077a',
  //         800: '#35024a',
  //         900: '#16001c',
  //       },
  //       primary: defaultTheme.colors[colorScheme],
  //     },
  //     components: {
  //       Button: {
  //         baseStyle: {
  //           _focus: { boxShadow: 'none' },
  //         },
  //         variants: {
  //           solid: (props) => ({
  //             bg: props.colorMode === 'dark' ? `${colorScheme}.500` : `${colorScheme}.600`,
  //             _hover: {
  //               bg: props.colorMode === 'dark' ? `${colorScheme}.400` : `${colorScheme}.700`,
  //             },
  //           }),
  //         },
  //       },
  //       Table: {
  //         baseStyle: {
  //           _focus: { boxShadow: 'none' },
  //         },
  //         variants: {
  //           solid: (props) => ({
  //             bg: props.colorMode === 'dark' ? `${colorScheme}.500` : `${colorScheme}.600`,
  //             _hover: {
  //               bg: props.colorMode === 'dark' ? `${colorScheme}.400` : `${colorScheme}.700`,
  //             },
  //           }),
  //         },
  //       },
  //     },
  //   });
  // };

    // // Memoize the theme to avoid unnecessary re-renders
    // const theme = useMemo(() => {
    //   const colorScheme = profile?.theme || 'gray';
    //   return extendTheme({
    //     ...chakraTheme,
    //     colors: {
    //       ...chakraTheme.colors,
    //       alternatePurple: {
    //         50: '#ffe5fe',
    //         100: '#f8b5fd',
    //         200: '#ee84f9',
    //         300: '#e254f7',
    //         400: '#d226f5',
    //         500: '#b112dc',
    //         600: '#850cab',
    //         700: '#5b077a',
    //         800: '#35024a',
    //         900: '#16001c',
    //       },
    //       primary: chakraTheme.colors[colorScheme] || chakraTheme.colors.gray,
    //     },
    //     components: {
    //       ...chakraTheme.components,
    //       Button: {
    //         ...chakraTheme.components?.Button,
    //         baseStyle: {
    //           ...chakraTheme.components?.Button?.baseStyle,
    //           _focus: { boxShadow: 'none' },
    //         },
    //         variants: {
    //           ...chakraTheme.components?.Button?.variants,
    //           solid: (props) => ({
    //             ...chakraTheme.components?.Button?.variants?.solid?.(props),
    //             bg: props.colorMode === 'dark' ? `${colorScheme}.500` : `${colorScheme}.600`,
    //             _hover: {
    //               bg: props.colorMode === 'dark' ? `${colorScheme}.400` : `${colorScheme}.700`,
    //             },
    //           }),
    //         },
    //       },
    //       Table: {
    //         ...chakraTheme.components?.Table,
    //         baseStyle: {
    //           ...chakraTheme.components?.Table?.baseStyle,
    //           _focus: { boxShadow: 'none' },
    //         },
    //         variants: {
    //           ...chakraTheme.components?.Table?.variants,
    //           solid: (props) => ({
    //             ...chakraTheme.components?.Table?.variants?.solid?.(props),
    //             bg: props.colorMode === 'dark' ? `${colorScheme}.500` : `${colorScheme}.600`,
    //             _hover: {
    //               bg: props.colorMode === 'dark' ? `${colorScheme}.400` : `${colorScheme}.700`,
    //             },
    //           }),
    //         },
    //       },
    //     },
    //   });
    // }, [chakraTheme, profile?.theme]);

  // useEffect(() => {
  //   console.log(profile?.theme)
  //   setProfileTheme(profile?.theme)
  // }, [profile?.theme])

  // const theme = profileTheme ? getChakraTheme(profileTheme) : defaultTheme;

  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )

}