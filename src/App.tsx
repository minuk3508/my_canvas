import { ThemeProvider } from "styled-components";
import Router from "./Router";
import { GlobalStyle } from "./Style/GlobalStyle";
import { lightTheme } from "./Style/Theme";
import { RecoilRoot } from "recoil";
function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle />
        <Router />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
