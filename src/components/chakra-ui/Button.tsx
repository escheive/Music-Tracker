import { defineStyleConfig } from '@chakra-ui/react'

export const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    solid: {
      border: '2px solid',
      borderColor: 'alternatePurple.200',
      color: 'fbfbfb',
      backgroundColor: 'alternatePurple.100',
      _hover: {
        backgroundColor: 'alternatePurple.200'
      }
    },
    outline: {
      border: '2px solid',
      borderColor: 'alternatePurple.200',
      color: 'alternatePurple.200',
      backgroundColor: 'transparent',
      _hover: {
        color: 'alternatePurple.300',
        backgroundColor: 'alternatePurple.100'
      }
    },
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'solid',
  },
})