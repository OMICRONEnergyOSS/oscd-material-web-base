/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* components imported at this level, so the internal component can remain side-effect free */
import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';
import '../badge/badge.js';

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {NavigationTab} from './internal/navigation-tab.js';
import {styles} from './internal/navigation-tab-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-tab': MdNavigationTab;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-tab')
export class MdNavigationTab extends NavigationTab {
  static override styles: CSSResultOrNative[] = [styles];
}
