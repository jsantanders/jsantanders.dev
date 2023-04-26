describe("english", () => {
  it("should find the h1 heading", () => {
    cy.visit("/");
    cy.findByRole("heading", { name: /Jesus Santander/i }).should("exist");
  });
});

describe("spanish", () => {
  it("should find the h1 heading", () => {
    cy.visit("/es");
    cy.findByRole("heading", { name: /Jesús Santander/i }).should("exist");
  });
});
