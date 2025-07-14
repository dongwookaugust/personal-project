describe("HoverCard E2E Test", () => {
  beforeEach(() => {
    const MOCK_RANDOM_ITEMS = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      original_title: i === 0 ? "Featured Movie" : `Top 10 Movie ${i}`,
      name: i === 0 ? "Featured Movie" : `Top 10 Movie ${i}`,
      backdrop_path: `/backdrop_top10_${i}.jpg`,
      imageUrl: `/image_top10_${i}.jpg`,
      overview: "This is a great featured movie.",
      maturity: "15+",
    }));

    const MOCK_SIMILAR_ITEMS = Array.from({ length: 15 }, (_, i) => ({
      id: 100 + i,
      original_title:
        i === 0 ? "The First Similar Movie" : `Similar Movie ${i + 1}`,
      name: i === 0 ? "The First Similar Movie" : `Similar Movie ${i + 1}`,
      imageUrl: `/image_similar_${i}.jpg`,
      backdrop_path: `/backdrop_similar_${i}.jpg`,
      overview: "This is a similar movie.",
      maturity: "15+",
      episodes: 12,
      episodesDetail: Array.from({ length: 12 }, (v, k) => ({
        id: k,
        title: `Episode ${k + 1}`,
        description: `Description for episode ${k + 1}`,
        runtime: `45min`,
        thumbnailUrl: `/thumb_${k}.jpg`,
      })),
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

  it("should show episode information when hovering over a content card and clicking the expand button", () => {
    const similarTitle = `The First Similar Movie Similar Content`;

    const contentRow = cy
      .contains("h2", similarTitle)
      .closest(".content-row-background")
      .scrollIntoView();

    const firstCard = contentRow.find(".card").not(".blank").first();
    firstCard.trigger("mouseover", { force: true });
    cy.get(".hover-card").should("be.visible").find(".info-btn").click();
    cy.get(".hover-card-expanded").contains("Episode 1").should("be.visible");
  });
});
