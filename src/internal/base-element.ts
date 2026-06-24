import { LitElement } from 'lit'

export abstract class BaseElement extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  }

  protected emit(name: string, options?: CustomEventInit): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        ...options,
      }),
    )
  }
}
