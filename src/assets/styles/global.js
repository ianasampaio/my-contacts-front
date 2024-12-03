import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'sora', sans-serif;
  }

  body {
    font-size: 16px;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.gray[900]};
  }

  button {
    cursor: pointer;
  }
`;
