import { html, css, PropertyValues } from 'lit'
import { property, customElement, query, queryAll } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface GroupButtonItem {
  value: string
  label: string
  disabled?: boolean
}

/**
 * @tag mac-group-button
 * @summary A macOS-style segmented control component.
 *
 * @slot - Default slot for group button items.
 *
 * @csspart container - The main container.
 * @csspart slider - The sliding background indicator.
 * @csspart button - Individual button elements.
 *
 * @event mac-change - Emitted when the selected value changes.
 */
@customElement('mac-group-button')
export class MacGroupButton extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      .group-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        background: var(--md-glass-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 1px solid var(--md-glass-border);
        border-radius: var(--md-group-button-container-radius);
        padding: 3px;
        box-shadow:
          inset 0 1px 0 var(--md-glass-highlight-top),
          inset 0 -1px 0 var(--md-glass-highlight-bottom),
          var(--md-shadow-menu);
        overflow: hidden;
      }

      .slider {
        position: absolute;
        top: 3px;
        left: 3px;
        height: calc(100% - 6px);
        background: var(--md-group-button-item-selected-bg);
        border-radius: calc(var(--md-group-button-container-radius) - 2px);
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.12),
          0 1px 2px rgba(0, 0, 0, 0.08);
        transition:
          transform 280ms cubic-bezier(0.4, 0, 0.2, 1),
          width 280ms cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform, width;
        z-index: 1;
      }

      .button-wrapper {
        position: relative;
        z-index: 2;
      }

      .button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--md-group-button-item-padding-vertical)
          var(--md-group-button-item-padding-horizontal);
        font-size: var(--md-group-button-item-font-size);
        font-family: var(--md-font-family);
        font-weight: 500;
        line-height: 1.4;
        color: var(--md-group-button-item-color);
        background: transparent;
        border: none;
        border-radius: calc(var(--md-group-button-container-radius) - 2px);
        cursor: pointer;
        transition:
          color 150ms ease,
          opacity 150ms ease;
        user-select: none;
        white-space: nowrap;
        -webkit-font-smoothing: antialiased;
      }

      .button:hover:not(.button--selected):not(:disabled) {
        color: var(--md-group-button-item-active-color);
      }

      .button--selected {
        color: var(--md-group-button-item-selected-color);
        text-shadow: 0 -0.5px 0 rgba(0, 0, 0, 0.15);
      }

      .button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .button:focus-visible {
        outline: 2px solid var(--md-group-button-item-focus-outline);
        outline-offset: 2px;
      }

      /* Sizes */
      :host([size='sm']) .button {
        padding: var(--sm-group-button-item-padding-vertical)
          var(--sm-group-button-item-padding-horizontal);
        font-size: var(--sm-group-button-item-font-size);
      }

      :host([size='lg']) .button {
        padding: var(--lg-group-button-item-padding-vertical)
          var(--lg-group-button-item-padding-horizontal);
        font-size: var(--lg-group-button-item-font-size);
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        :host(:not([data-theme='light'])) .group-container {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        :host(:not([data-theme='light'])) .button {
          color: rgba(255, 255, 255, 0.85);
        }

        :host(:not([data-theme='light'])) .button:hover:not(.button--selected):not(:disabled) {
          color: var(--md-mac-text-white);
        }
      }

      :host([data-theme='dark']) .group-container {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.15);
      }

      :host([data-theme='dark']) .button {
        color: rgba(255, 255, 255, 0.85);
      }

      :host([data-theme='dark']) .button:hover:not(.button--selected):not(:disabled) {
        color: var(--md-mac-text-white);
      }
    `,
  ]

  /** The array of button items. */
  @property({ type: Array }) items: GroupButtonItem[] = []

  /** The currently selected value. */
  @property({ reflect: true }) value = ''

  /** The size of the buttons. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Disables all buttons. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @query('.slider') private slider!: HTMLElement
  @queryAll('.button') private buttons!: NodeListOf<HTMLButtonElement>

  private _selectedIndex = 0

  override willUpdate() {
    const size = this._resolvedSize
    if (this.getAttribute('size') !== size) {
      this.setAttribute('size', size)
    }
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties)

    // Set initial value if not provided
    this._setInitialValue()

    // Update slider position after render
    requestAnimationFrame(() => {
      this._updateSliderPosition(false)
    })
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    if (changedProperties.has('items')) {
      // Set initial value when items are updated
      this._setInitialValue()
    }

    if (changedProperties.has('value') || changedProperties.has('items')) {
      requestAnimationFrame(() => {
        this._updateSliderPosition(true)
      })
    }
  }

  private _setInitialValue() {
    if (!this.value && this.items.length > 0) {
      const enabledItem = this.items.find((item) => !item.disabled)
      if (enabledItem) {
        this.value = enabledItem.value
      }
    }
  }

  private _updateSliderPosition(animate: boolean) {
    if (!this.slider || !this.buttons || this.buttons.length === 0) return

    const selectedIndex = this.items.findIndex((item) => item.value === this.value)
    if (selectedIndex === -1) return

    this._selectedIndex = selectedIndex
    const button = this.buttons[selectedIndex]
    if (!button) return

    if (!animate) {
      this.slider.style.transition = 'none'
    } else {
      this.slider.style.transition =
        'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), width 280ms cubic-bezier(0.4, 0, 0.2, 1)'
    }

    // Use offsetLeft to get the button's position relative to the container
    const offset = button.offsetLeft

    this.slider.style.width = `${button.offsetWidth}px`
    this.slider.style.transform = `translateX(${offset}px)`

    // Force reflow to ensure transition is applied
    if (!animate) {
      this.slider.offsetHeight
      this.slider.style.transition =
        'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), width 280ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }

  private _handleButtonClick(item: GroupButtonItem, index: number) {
    if (item.disabled || this.disabled) return

    if (this.value !== item.value) {
      this.value = item.value
      this._selectedIndex = index
      this.emit('mac-change', {
        detail: {
          value: this.value,
          item,
          index,
        },
      })
    }
  }

  private _handleKeyDown(event: KeyboardEvent, item: GroupButtonItem, index: number) {
    if (this.disabled) return

    let newIndex = index

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        newIndex = this._getPreviousEnabledIndex(index)
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        newIndex = this._getNextEnabledIndex(index)
        break
      case 'Home':
        event.preventDefault()
        newIndex = this._getFirstEnabledIndex()
        break
      case 'End':
        event.preventDefault()
        newIndex = this._getLastEnabledIndex()
        break
      case ' ':
      case 'Enter':
        event.preventDefault()
        this._handleButtonClick(item, index)
        return
      default:
        return
    }

    if (newIndex !== index && newIndex !== -1) {
      const newItem = this.items[newIndex]
      this._handleButtonClick(newItem, newIndex)
      ;(this.buttons[newIndex] as HTMLButtonElement)?.focus()
    }
  }

  private _getPreviousEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.items[i].disabled) return i
    }
    return currentIndex
  }

  private _getNextEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex + 1; i < this.items.length; i++) {
      if (!this.items[i].disabled) return i
    }
    return currentIndex
  }

  private _getFirstEnabledIndex(): number {
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].disabled) return i
    }
    return 0
  }

  private _getLastEnabledIndex(): number {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (!this.items[i].disabled) return i
    }
    return this.items.length - 1
  }

  override render() {
    return html`
      <div part="container" class="group-container" role="radiogroup">
        <div part="slider" class="slider"></div>
        <div class="button-wrapper">
          ${this.items.map(
            (item, index) => html`
              <button
                part="button"
                class="button ${this.value === item.value ? 'button--selected' : ''}"
                ?disabled=${this.disabled || item.disabled}
                role="radio"
                aria-checked=${this.value === item.value}
                tabindex=${this.value === item.value ? '0' : '-1'}
                @click=${() => this._handleButtonClick(item, index)}
                @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, item, index)}
              >
                ${item.label}
              </button>
            `,
          )}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-group-button': MacGroupButton
  }
}
