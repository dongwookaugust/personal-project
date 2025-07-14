describe("contetnRow End-to-End Test", () => {
  beforeEach(() => {
    const MOCK_RANDOM_ITEMS = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      original_title: `Featured or Top 10 Movie ${i}`,
      name: `Featured or Top 10 Movie ${i}`,
      backdrop_path: `/backdrop_top10_${i}.jpg`,
      imageUrl: `/image_top10_${i}.jpg`,
    }));

    const MOCK_SIMILAR_ITEMS = Array.from({ length: 15 }, (_, i) => ({
      id: 100 + i,
      original_title:
        i === 0 ? "The First Similar Movie" : `Similar Movie ${i + 1}`,
      name: i === 0 ? "The First Similar Movie" : `Similar Movie ${i + 1}`,
      imageUrl: `/image_similar_${i}.jpg`,
      backdrop_path: `/backdrop_similar_${i}.jpg`,
    }));

    cy.intercept("GET", "**/movies/random/*?category=random*", {
      body: MOCK_RANDOM_ITEMS,
    }).as("getRandom");

    cy.intercept("GET", "**/movies/random/*?category=similar*", {
      body: MOCK_SIMILAR_ITEMS,
    }).as("getSimilar");

    cy.intercept("GET", "**/movies/random/*?category=continue*", {
      body: [],
    }).as("getContinue");

    cy.visit("/");

    cy.wait(["@getRandom", "@getSimilar", "@getContinue"]);
  });

  it("all elements on the main page should render correctly and the slider should be functional", () => {
    const similarTitle = `The First Similar Movie Similar Content`;

    const contentRow = cy
      .contains("h2", similarTitle)
      .closest(".content-row-background")
      .scrollIntoView();

    contentRow.find(".row-wrapper").trigger("mouseover");

    contentRow.find('[data-testid="next-button"]').should("be.visible").click();

    cy.wait(500);

    cy.contains("h2", similarTitle)
      .closest(".content-row-background")
      .find(".card")
      .should("not.contain", "The First Similar Movie");
  });
});
