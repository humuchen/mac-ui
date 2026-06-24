import { css, CSSResult } from 'lit'

export const sharedStyles: CSSResult = css`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }
`
