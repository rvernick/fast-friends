/// <reference types="cypress" />

import Chance from 'chance';

// Welcome to Cypress!
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('create account', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8081/sign-up')
  })

  it('Can create a new account', () => {
    const chance = new Chance();
    const randomEmail = chance.email({ domain: 'example.com' });
    const password123 = 'pa$$Word123';
    cy.get('[data-testid="emailInput"]').type(`${randomEmail}{enter}`)
    cy.get('[data-testid="passwordInput"]').type(`${password123}{enter}`)
    cy.get('[data-testid="passwordConfirmInput"]').type(`${password123}{enter}`)
    cy.get('[data-testid="button"]').click()
    
    // should have been redirected to the login page
    cy.url().should('include', '/sign-in')
  })

  it('invalid email', () => {
    const badEmail = 'noampersand';
    const password123 = 'pa$$Word123';
    cy.get('[data-testid="emailInput"]').type(`${badEmail}{enter}`)
    cy.get('[data-testid="passwordInput"]').type(`${password123}{enter}`)
    cy.get('[data-testid="passwordConfirmInput"]').type(`${password123}{enter}`)
    cy.contains('Please enter valid email').should('be.visible')
  })

  it('invalid password', () => {
    const chance = new Chance();
    const randomEmail = chance.email({ domain: 'example.com' });
    const password123 = 'short';
    cy.get('[data-testid="emailInput"]').type(`${randomEmail}{enter}`)
    cy.get('[data-testid="passwordInput"]').type(`${password123}{enter}`)
    cy.get('[data-testid="passwordConfirmInput"]').type(`${password123}{enter}`)
    cy.contains('password must be at least 8 characters ').should('be.visible')
  })

  // context('with a checked task', () => {
  //   beforeEach(() => {
  //     // We'll take the command we used above to check off an element
  //     // Since we want to perform multiple tests that start with checking
  //     // one element, we put it in the beforeEach hook
  //     // so that it runs at the start of every test.
  //     cy.contains('Pay electric bill')
  //       .parent()
  //       .find('input[type=checkbox]')
  //       .check()
  //   })

  //   it('can filter for uncompleted tasks', () => {
  //     // We'll click on the "active" button in order to
  //     // display only incomplete items
  //     cy.contains('Active').click()

  //     // After filtering, we can assert that there is only the one
  //     // incomplete item in the list.
  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .first()
  //       .should('have.text', 'Walk the dog')

  //     // For good measure, let's also assert that the task we checked off
  //     // does not exist on the page.
  //     cy.contains('Pay electric bill').should('not.exist')
  //   })

  //   it('can filter for completed tasks', () => {
  //     // We can perform similar steps as the test above to ensure
  //     // that only completed tasks are shown
  //     cy.contains('Completed').click()

  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .first()
  //       .should('have.text', 'Pay electric bill')

  //     cy.contains('Walk the dog').should('not.exist')
  //   })

  //   it('can delete all completed tasks', () => {
  //     // First, let's click the "Clear completed" button
  //     // `contains` is actually serving two purposes here.
  //     // First, it's ensuring that the button exists within the dom.
  //     // This button only appears when at least one task is checked
  //     // so this command is implicitly verifying that it does exist.
  //     // Second, it selects the button so we can click it.
  //     cy.contains('Clear completed').click()

  //     // Then we can make sure that there is only one element
  //     // in the list and our element does not exist
  //     cy.get('.todo-list li')
  //       .should('have.length', 1)
  //       .should('not.have.text', 'Pay electric bill')

  //     // Finally, make sure that the clear button no longer exists.
  //     cy.contains('Clear completed').should('not.exist')
  //   })
  // })
})
