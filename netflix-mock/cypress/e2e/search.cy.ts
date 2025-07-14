describe("Search Functionality E2E Test", () => {
  beforeEach(() => {
    const MOCK_RANDOM_ITEMS = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      original_title: `Movie ${i}`,
      name: `Movie ${i}`,
      backdrop_path: "/fake.jpg",
    }));

    cy.intercept("GET", "**/movies/random*?category=random*", {
      body: MOCK_RANDOM_ITEMS,
    }).as("getRandom");
    cy.intercept("GET", "**/movies/random*?category=similar*", {
      body: [],
    }).as("getSimilar");
    cy.intercept("GET", "**/movies/random*?category=continue*", {
      body: [],
    }).as("getContinue");
    cy.intercept("GET", "**/search/movie?query=Matrix*", {
      body: { results: [] },
    }).as("getSearchResults");
    cy.visit("/");
  });

  it("typing a search query and pressing Enter should navigate to the search results page", () => {
    cy.get(".search-icon").click();
    cy.get(".search-input").should("be.visible").type("Matrix{enter}");
    cy.url().should("include", "/search?q=Matrix");
  });
});
