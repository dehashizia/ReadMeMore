// src/app/auth/login/__tests__/page.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import LoginPage from '../page'

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  isAxiosError: jest.fn()
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn()
    }
  }
}))

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('LoginPage', () => {
  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock localStorage properly
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    })

    // Mock successful CSRF token fetch
    ;(axios.get as jest.Mock).mockResolvedValue({
      data: { csrfToken: 'fake-csrf-token' }
    })
  })

  it('should render login form', async () => {
    await act(async () => {
      render(<LoginPage />)
    })
    
    expect(screen.getByText('Login to Your Account')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('should show error when passwords do not match', async () => {
    await act(async () => {
      render(<LoginPage />)
    })
    
    const user = userEvent.setup()

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'different')
      await user.click(screen.getByRole('button', { name: /login/i }))
    })

    expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument()
  })

  it('should handle successful login', async () => {
    await act(async () => {
      render(<LoginPage />)
    })
    
    const user = userEvent.setup()

    // Mock successful login response
    ;(axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'fake-token' }
    })

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))
    })

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token')
      expect(screen.getByText('Login successful! Redirecting to Actus page...')).toBeInTheDocument()
    })
  })

  it('should handle login failure', async () => {
    await act(async () => {
      render(<LoginPage />)
    })
    
    const user = userEvent.setup()

    // Mock login error
    ;(axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } }
    })
    ;(axios.isAxiosError as jest.Mock).mockReturnValueOnce(true)

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'password123')
      await user.type(screen.getByLabelText(/confirm password/i), 'password123')
      await user.click(screen.getByRole('button', { name: /login/i }))
    })

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})