// cypress/integration/app.spec.js
import { setupClerkTestingToken } from "@clerk/testing/cypress";
//signup the test user before running the test with setupClerkTestingToken

describe("Sign in", () => {
  it("sign up", () => {
    setupClerkTestingToken();
  });
});

describe("Navigation", () => {
  it("should navigate to the about page", () => {
    cy.visit("http://localhost:3000/");
  });
});

const asModule = {};
export default asModule;
