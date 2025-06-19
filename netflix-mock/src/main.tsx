import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const hoverLayerDiv = document.createElement("div");
hoverLayerDiv.id = "hover-layer";
document.body.appendChild(hoverLayerDiv);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
