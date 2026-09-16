import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { App } from "./App";
import { store } from "./redux/store";
import "./styles/global.css";

const rootElement: HTMLElement | null = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root-Element '#root' wurde nicht gefunden.");
}

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
