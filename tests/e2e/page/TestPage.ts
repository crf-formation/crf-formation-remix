import type { Page } from "playwright";
import { expect } from "~/tests/playwright-utils";

type GetByRoleOptions = {
  /**
   * An attribute that is usually set by `aria-checked` or native `<input type=checkbox>` controls.
   *
   * Learn more about [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
   */
  checked?: boolean;

  /**
   * An attribute that is usually set by `aria-disabled` or `disabled`.
   *
   * **NOTE** Unlike most other attributes, `disabled` is inherited through the DOM hierarchy. Learn more about
   * [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled).
   */
  disabled?: boolean;

  /**
   * Whether `name` is matched exactly: case-sensitive and whole-string. Defaults to false. Ignored when `name` is a
   * regular expression. Note that exact match still trims whitespace.
   */
  exact?: boolean;

  /**
   * An attribute that is usually set by `aria-expanded`.
   *
   * Learn more about [`aria-expanded`](https://www.w3.org/TR/wai-aria-1.2/#aria-expanded).
   */
  expanded?: boolean;

  /**
   * Option that controls whether hidden elements are matched. By default, only non-hidden elements, as
   * [defined by ARIA](https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion), are matched by role selector.
   *
   * Learn more about [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.2/#aria-hidden).
   */
  includeHidden?: boolean;

  /**
   * A number attribute that is usually present for roles `heading`, `listitem`, `row`, `treeitem`, with default values
   * for `<h1>-<h6>` elements.
   *
   * Learn more about [`aria-level`](https://www.w3.org/TR/wai-aria-1.2/#aria-level).
   */
  level?: number;

  /**
   * Option to match the [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). By default, matching is
   * case-insensitive and searches for a substring, use `exact` to control this behavior.
   *
   * Learn more about [accessible name](https://w3c.github.io/accname/#dfn-accessible-name).
   */
  name?: string|RegExp;

  /**
   * An attribute that is usually set by `aria-pressed`.
   *
   * Learn more about [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed).
   */
  pressed?: boolean;

  /**
   * An attribute that is usually set by `aria-selected`.
   *
   * Learn more about [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected).
   */
  selected?: boolean;
}

/**
 * Abstract class to test a page.
 * Provides helpers to simplify tests.
 *
 * Inspired by https://medium.com/geekculture/mastering-playwright-how-to-create-effective-page-objects-ecbc06786c95
 */
export abstract class TestPage {
  protected page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected async expectPageToHaveURL(endpoint: string|RegExp) {
    await expect(this.page).toHaveURL(endpoint);
  }

  // helpers / page shortcut
  // inspired by https://gist.github.com/diegohaz/6e3e253af14c213c5ec816badd3c369e
  // https://twitter.com/diegohaz/status/1707329405398167831?s=12&t=ubdKtaftththRQwWUPhj_g

  protected textbox(name: string|RegExp, options: GetByRoleOptions = {}) {
    return this.page.getByRole('textbox', { name, ...options })
  }

  protected button(name: string|RegExp, options: GetByRoleOptions = {}) {
    return this.page.getByRole('button', { name, ...options })
  }

}

