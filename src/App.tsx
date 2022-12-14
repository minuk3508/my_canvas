import { ThemeProvider } from "styled-components";
import Router from "./Router";
import { GlobalStyle } from "./Style/GlobalStyle";
import { lightTheme } from "./Style/Theme";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
