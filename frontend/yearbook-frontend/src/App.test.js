import { render, screen } from '@testing-library/react';
jest.mock('axios', () => ({ post: jest.fn() }));
import App from './App';

test('renders the yearbook login screen', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /login to yearbook/i })).toBeInTheDocument();
});
