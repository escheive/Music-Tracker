import { Auth } from '@supabase/auth-ui-react';
import supabase from '@api/supabase';
import { Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthProvider';

const customTheme = {
  default: {
    colors: {
      brand: 'white',
      brandAccent: '#eaeaea',
      brandButtonText: '#4A5568',
      defaultButtonBackground: 'white',
      defaultButtonBackgroundHover: '#eaeaea',
      defaultButtonBorder: 'lightgray',
      defaultButtonText: '#4A5568',
      dividerBackground: 'lightgray',
      inputBackground: 'white',
      inputBorder: 'lightgray',
      inputBorderHover: 'gray',
      inputBorderFocus: 'gray',
      inputText: 'black',
      inputLabelText: 'gray',
      inputPlaceholder: '#4A5568',
      messageText: '#2b805a',
      messageBackground: '#e7fcf1',
      messageBorder: '#d0f3e1',
      messageTextDanger: '#ff6369',
      messageBackgroundDanger: '#fff8f8',
      messageBorderDanger: '#822025',
      anchorTextColor: '#4A5568',
      anchorTextHoverColor: 'darkgray',
    },
    space: {
      spaceSmall: '4px',
      spaceMedium: '8px',
      spaceLarge: '16px',
      labelBottomMargin: '8px',
      anchorBottomMargin: '4px',
      emailInputSpacing: '4px',
      socialAuthSpacing: '4px',
      buttonPadding: '10px 15px',
      inputPadding: '10px 15px',
    },
    fontSizes: {
      baseBodySize: '13px',
      baseInputSize: '14px',
      baseLabelSize: '14px',
      baseButtonSize: '14px',
    },
    fonts: {
      bodyFontFamily: `ui-sans-serif, sans-serif`,
      buttonFontFamily: `ui-sans-serif, sans-serif`,
      inputFontFamily: `ui-sans-serif, sans-serif`,
      labelFontFamily: `ui-sans-serif, sans-serif`,
    },
    borderWidths: {
      buttonBorderWidth: '1px',
      inputBorderWidth: '1px',
    },
    radii: {
      borderRadiusButton: '8px',
      buttonBorderRadius: '8px',
      inputBorderRadius: '8px',
    },
  },
}

export const LoginRoute = () => {
  const navigate = useNavigate();
  const { session } = useAuthContext();

  if (session) {
    navigate('/profile')
  }

  return (
    <Box padding={4} height='100vh'>
      {!session ? (
        <Auth 
          supabaseClient={supabase} 
          theme='default'
          appearance={{
            theme: customTheme,
          }}
        />
      ) : (
        <Text>You are already logged in!</Text>
      )}
    </Box>
  );
};