import { render, screen } from '@testing-library/react'
import App from '@/app';
import { act } from 'react-dom/test-utils';

describe('App', () => {
  it('renders the App component', async () => {
    await act(async () => {
      render(<App />);
    });
    // render(<AppProvider />)
    
    screen.debug(); // prints out the jsx in the App component unto the command line
  })
})