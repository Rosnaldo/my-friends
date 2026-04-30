describe("Página 404", () => {
  beforeEach(() => {
    cy.visit("/rota-que-nao-existe");
  });

  it("exibe o texto 404", () => {
    cy.contains("404").should("be.visible");
  });

  it("exibe a mensagem de página não encontrada", () => {
    cy.contains("Página não encontrada").should("be.visible");
  });

  it("possui link para voltar ao login", () => {
    cy.contains("Voltar para o login")
      .should("be.visible")
      .and("have.attr", "href", "/login");
  });
});
