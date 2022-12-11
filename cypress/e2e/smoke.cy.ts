import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  const loginForm = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `${faker.internet.userName()}@example.com`,
    password: faker.internet.password(),
  };

  afterEach(() => {
    cy.cleanupUser();
  });

  it("should create user", () => {
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/join");

    cy.get("input[name=firstName]").type(loginForm.firstName);
    cy.get("input[name=lastName]").type(loginForm.lastName);
    cy.get("input[name=email]").type(loginForm.email);
    cy.get("input[name=password]").type(loginForm.password);

    cy.get('Button[type="submit"]').click()
  });

  it("should allow you to login", () => {
    const loginForm = {
      email: `test@example.com`,
      password: `bonjour1`,
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");


    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /log in/i }).click();

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
  });


  it("should mark user as invalid", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");


    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /Log in/i }).click();

    cy.get("#email-form-error").should('exist')
  });

});
