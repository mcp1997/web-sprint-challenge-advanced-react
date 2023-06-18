// Write your tests here
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'
import AppFunctional from './AppFunctional'

test('it renders without errors', () => {
  render(<AppFunctional />)
})

test('user can move UP once, LEFT once, and DOWN twice - correct coordinates and steps appear', async () => {
  render(<AppFunctional />)

  const upButton = screen.getByTestId(/up/i)
  const leftButton = screen.getByTestId(/left/i)
  const downButton = screen.getByTestId(/down/i)
  await userEvent.click(upButton)
  await userEvent.click(leftButton)
  await userEvent.click(downButton)
  await userEvent.click(downButton)

  const coordinates = await screen.findByTestId(/coordinates/i)
  const steps = await screen.findByTestId(/steps/i)
  expect(coordinates).toBeInTheDocument()
  expect(coordinates).toHaveTextContent('Coordinates (1, 3)')
  expect(steps).toBeInTheDocument()
  expect(steps).toHaveTextContent(/you moved 4 times/i)
})

test('user can move RIGHT once, LEFT twice, UP once, and RESET - correct coordinates and steps appear', async () => {
  render(<AppFunctional />)

  const rightButton = screen.getByTestId(/right/i)
  const leftButton = screen.getByTestId(/left/i)
  const upButton = screen.getByTestId(/up/i)
  const resetButton = screen.getByTestId(/reset/i)
  await userEvent.click(rightButton)
  await userEvent.click(leftButton)
  await userEvent.click(leftButton)
  await userEvent.click(upButton)
  await userEvent.click(resetButton)

  const coordinates = await screen.findByTestId(/coordinates/i)
  const steps = await screen.findByTestId(/steps/i)
  expect(coordinates).toBeInTheDocument()
  expect(coordinates).toHaveTextContent('Coordinates (2, 2)')
  expect(steps).toBeInTheDocument()
  expect(steps).toHaveTextContent(/you moved 0 times/i)
})

test('user can move UP once, but NOT twice - correct coordinates, steps, and message appear', async () => {
  render(<AppFunctional />)

  const upButton = screen.getByTestId(/up/i)
  await userEvent.click(upButton)
  await userEvent.click(upButton)

  const coordinates = await screen.findByTestId(/coordinates/i)
  const steps = await screen.findByTestId(/steps/i)
  const message = await screen.findByTestId(/message/i)
  expect(coordinates).toBeInTheDocument()
  expect(coordinates).toHaveTextContent('Coordinates (2, 1)')
  expect(steps).toBeInTheDocument()
  expect(steps).toHaveTextContent(/you moved 1 time/i)
  expect(message).toHaveTextContent(/you can't go up/i)
})

test('user can move DOWN once, RIGHT once, type in a valid email, and submit - correct coordinates, steps, and messages appear', async () => {
  render(<AppFunctional />)

  const downButton = screen.getByTestId(/down/i)
  const rightButton = screen.getByTestId(/right/i)
  await userEvent.click(downButton)
  await userEvent.click(rightButton)

  const coordinates = await screen.findByTestId(/coordinates/i)
  const steps = await screen.findByTestId(/steps/i)
  expect(coordinates).toBeInTheDocument()
  expect(coordinates).toHaveTextContent('Coordinates (3, 3)')
  expect(steps).toBeInTheDocument()
  expect(steps).toHaveTextContent(/you moved 2 times/i)

  const emailInput = screen.getByPlaceholderText(/type email/i)
  await userEvent.type(emailInput, 'matt@matt.com')
  expect(emailInput).toHaveValue('matt@matt.com')

  const submitButton = screen.getByTestId(/submit/i)
  await userEvent.click(submitButton)
  await waitFor(() => {
    expect(emailInput).toHaveValue('')
  })
  
  const message = await screen.findByTestId(/message/i)
  expect(message).toHaveTextContent(/matt win #73/i)
})

test('user can move LEFT once, CANNOT move LEFT again, type in forbidden email, and submit - correct coordinates, steps, and messages appear', async () => {
  render(<AppFunctional />)

  const leftButton = screen.getByTestId(/left/i)
  await userEvent.click(leftButton)
  await userEvent.click(leftButton)

  const coordinates = await screen.findByTestId(/coordinates/i)
  const steps = await screen.findByTestId(/steps/i)
  const message = await screen.findByTestId(/message/i)
  expect(coordinates).toBeInTheDocument()
  expect(coordinates).toHaveTextContent('Coordinates (1, 2)')
  expect(steps).toBeInTheDocument()
  expect(steps).toHaveTextContent(/you moved 1 time/i)
  expect(message).toHaveTextContent(/you can't go left/i)

  const emailInput = screen.getByPlaceholderText(/type email/i)
  await userEvent.type(emailInput, 'foo@bar.baz')
  expect(emailInput).toHaveValue('foo@bar.baz')

  const submitButton = screen.getByTestId(/submit/i)
  await userEvent.click(submitButton)
  await waitFor(() => {
    expect(emailInput).toHaveValue('')
    expect(message).toHaveTextContent(/foo@bar.baz failure #27/i)
  })
})