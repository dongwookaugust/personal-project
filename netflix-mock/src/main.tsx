// src/main.tsx
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Redux Provider 임포트
import { store } from "./store"; // Redux Store 임포트
import App from "./App"; // App 컴포넌트 임포트

// import { AuthProvider } from "./context/AuthContext"; // 이 줄을 제거합니다.
import { BrowserRouter } from "react-router-dom"; // BrowserRouter 임포트
import "./index.css"; // 기본 CSS 임포트

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    {/* <AuthProvider>  이 부분을 제거합니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </AuthProvider> */}
  </Provider>
);
