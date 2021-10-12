import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Helvetica';
  }
  body {
    padding: 0px;
    margin: 0px;
    width: 100vw;
    overflow-y: auto;
    overflow-x: auto;
    background-color: #E1E1E2;
  }
  @keyframes Spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export default GlobalStyle;