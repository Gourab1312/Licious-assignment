import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(
      '33333333-3333-4333-8333-333333333333',
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a task and marks it completed', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Task title'), 'Ship dashboard')
    await user.type(
      screen.getByLabelText('Task description'),
      'Prepare final assignment submission',
    )
    await user.selectOptions(screen.getByLabelText('Task priority'), 'High')
    await user.type(screen.getByLabelText('Task due date'), '2026-07-01')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(screen.getByText('Ship dashboard')).toBeInTheDocument()
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mark complete' }))
    expect(screen.getByText('Completed: 1')).toBeInTheDocument()
  })
})
