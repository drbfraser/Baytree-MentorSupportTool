// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@cypress/code-coverage/support'
import { mount } from 'cypress/react18'
import type { MountOptions } from 'cypress/react'
import type { ReactNode } from 'react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { worker } from '../../src/mocks/worker'
import './commands'

const mountWithRouter = (
  component: ReactNode,
  options: MountOptions & { routerProps?: MemoryRouterProps } = {}
) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options
  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>
  return mount(wrapped, mountOptions)
}

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      mountWithRouter: typeof mountWithRouter
    }
  }
}

Cypress.Commands.add('mount', mount)
Cypress.Commands.add('mountWithRouter', mountWithRouter)
Cypress.on('test:before:run:async', async () => {
  await worker.start()
})
