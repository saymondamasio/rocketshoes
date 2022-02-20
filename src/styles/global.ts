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

   .react-modal-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .react-modal {
    width: 100%;
    max-width: 576px;

    background-color: #fff;
    padding: 3rem;
    position: relative;

    border-radius: 0.25rem;
  }
`
