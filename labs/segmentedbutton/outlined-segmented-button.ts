/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/* components imported at this level, so the internal component can remain side-effect free */
import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {OutlinedSegmentedButton} from './internal/outlined-segmented-button.js';
import {styles as outlinedStyles} from './internal/outlined-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-segmented-button': MdOutlinedSegmentedButton;
  }
}

/**
 * MdOutlinedSegmentedButton is the custom element for the Material
 * Design outlined segmented button component.
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-segmented-button')
export class MdOutlinedSegmentedButton extends OutlinedSegmentedButton {
  static override styles: CSSResultOrNative[] = [sharedStyles, outlinedStyles];
}
