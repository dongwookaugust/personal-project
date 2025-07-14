import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";
import { contentApi } from "../store/api/contentApi";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const FAKE_MOVIES = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  original_title: i === 0 ? "Test Movie Title" : `Movie ${i + 1}`,
  overview: `This is the overview for movie ${i + 1}.`,
  poster_path: `/fake_poster${i + 1}.jpg`,
  backdrop_path: `/fake_backdrop${i + 1}.jpg`,
  adult: false,
}));

const server = setupServer(
  http.get("https://jsonfakery.com/movies/random/30", () => {
    return HttpResponse.json(FAKE_MOVIES);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = () => {
  const store = configureStore({
    reducer: {
      [contentApi.reducerPath]: contentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(contentApi.middleware),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </Provider>
  );
};

describe("Home Page", () => {
  test("should display the loading UI while the API is loading", () => {
    server.use(
      http.get("https://jsonfakery.com/movies/random/30", async () => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return HttpResponse.json(FAKE_MOVIES);
      })
    );
    renderComponent();
    expect(screen.getByAltText("netflix")).toBeInTheDocument();
  });

  test("should display movie titles on a successful API call", async () => {
    renderComponent();

    const movieTitleElement = await screen.findByText("Test Movie Title");
    expect(movieTitleElement).toBeInTheDocument();
  });

  test("should display an error message when the API call fails", async () => {
    server.use(
      http.get("https://jsonfakery.com/movies/random/30", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    renderComponent();
    const errorMessageElement = await screen.findByText(
      "An error occurred while fetching data."
    );
    expect(errorMessageElement).toBeInTheDocument();
  });
});
