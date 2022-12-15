import { BrowserRouter, Routes, Route } from "react-router-dom";
import WorldCanvas from "./Template/WorldCanvas";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WorldCanvas />} />
      </Routes>
    </BrowserRouter>
  );
}
