import { BrowserRouter, Routes, Route } from "react-router-dom";
import Template from "./Template/Template";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Template />} />
      </Routes>
    </BrowserRouter>
  );
}
