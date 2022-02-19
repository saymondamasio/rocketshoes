import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #191920 url('assets/background.svg') no-repeat center top;
    -webkit-font-smoothing: antialiased;
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px 50px;
  }

  body, input, button {
    font: 14px Roboto, sans-serif;
  }


  button {
    cursor: pointer;
  }
`
