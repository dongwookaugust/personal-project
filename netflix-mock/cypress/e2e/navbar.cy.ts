describe("Navbar E2E Test", () => {
  beforeEach(() => {
    const MOCK_RANDOM_ITEMS = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      original_title: `Movie ${i}`,
      name: `Movie ${i}`,
      backdrop_path: "/fake.jpg",
    }));

    cy.intercept("GET", "**/movies/random/*?category=random*", {
      body: MOCK_RANDOM_ITEMS,
    }).as("getRandom");
    cy.intercept("GET", "**/movies/random/*?category=similar*", {
      body: [],
    }).as("getSimilar");
    cy.intercept("GET", "**/movies/random/*?category=continue*", {
      body: [],
    }).as("getContinue");
    cy.visit("/");
    cy.wait(["@getRandom", "@getSimilar", "@getContinue"]);
  });

  it("clicking the search icon should open the search bar and allow text input", () => {
    cy.get(".search-icon").click();
    cy.get(".search-input")
      .should("be.visible")
      .type("avengers")
      .should("have.value", "avengers");
  });

  it("hovering over the profile icon should display the dropdown menu", () => {
    cy.get(".profile-toggle").trigger("mouseover");
    cy.get(".profile-dropdown").should("be.visible");
    cy.get(".profile-dropdown").contains("Account").should("be.visible");
  });
  it("Hovering over the bell icon should display the 'New Content' notification.", () => {
    cy.get(".notification-container").trigger("mouseover");
    cy.get(".notification-dropdown").should("be.visible");
    cy.get(".notification-item").contains("Movie 0").should("be.visible");
  });
});
