/**
 * @license
 * Copyright 2026 OMICRON electronics GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {MdDialog} from './dialog.js';

describe('stacked dialog scrims', () => {
  let lower: MdDialog;
  let upper: MdDialog;

  beforeEach(() => {
    lower = new MdDialog();
    upper = new MdDialog();
    lower.innerHTML = '<div slot="content"><button autofocus>Review</button></div>';
    upper.innerHTML = '<div slot="content"><button autofocus>Back</button></div>';
    lower.quick = true;
    upper.quick = true;
    document.body.append(lower, upper);
  });

  afterEach(async () => {
    await upper.close();
    await lower.close();
    upper.remove();
    lower.remove();
  });

  function getNativeDialog(dialog: MdDialog): HTMLDialogElement {
    const native = dialog.shadowRoot?.querySelector('dialog');
    if (!native) {
      throw new Error('Missing native dialog');
    }
    return native;
  }

  function getScrim(dialog: MdDialog): HTMLElement {
    const scrim = dialog.shadowRoot?.querySelector<HTMLElement>('.scrim');
    if (!scrim) {
      throw new Error('Missing scrim');
    }
    return scrim;
  }

  it('places each viewport-sized scrim in its own modal layer behind the content', async () => {
    await lower.show();
    await upper.show();
    for (const dialog of [lower, upper]) {
      const native = getNativeDialog(dialog);
      const scrim = getScrim(dialog);
      expect(native.matches(':modal')).toBeTrue();
      expect(scrim.parentElement).toBe(native);
      expect(getComputedStyle(scrim).zIndex).toBe('-1');
      expect(getComputedStyle(scrim).pointerEvents).toBe('none');
      const bounds = scrim.getBoundingClientRect();
      expect(bounds.x).toBe(0);
      expect(bounds.y).toBe(0);
      expect(bounds.width).toBe(window.innerWidth);
      expect(bounds.height).toBe(window.innerHeight);
      expect(getComputedStyle(native).opacity).toBe('1');
    }
  });

  it('retains scrim animations and the inherited scrim color', async () => {
    upper.quick = false;
    upper.style.setProperty('--md-sys-color-scrim', 'rgb(12, 34, 56)');
    await lower.show();
    const opened = upper.show();
    await upper.updateComplete;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const scrim = getScrim(upper);
    expect(scrim.getAnimations().length).toBeGreaterThan(0);
    await opened;
    expect(getComputedStyle(scrim).backgroundColor).toBe('rgb(12, 34, 56)');
    expect(getComputedStyle(scrim).opacity).toBe('0.32');
    await upper.close();
    expect(upper.open).toBeFalse();
    expect(lower.open).toBeTrue();
  });

  it('keeps the scrim viewport-sized throughout opening and closing animations', async () => {
    upper.quick = false;
    await lower.show();
    const checkTransition = async (transition: Promise<void>) => {
      await upper.updateComplete;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const native = getNativeDialog(upper);
      const container = native.querySelector<HTMLElement>('.container')!;
      const animations = native.getAnimations({subtree: true});
      expect(animations.length).toBeGreaterThan(0);
      for (const animation of animations) {
        animation.pause();
      }
      for (const progress of [0.1, 0.5, 0.9]) {
        for (const animation of animations) {
          const duration = animation.effect!.getTiming().duration;
          if (typeof duration === 'number') {
            animation.currentTime = duration * progress;
          }
        }
        expect(getComputedStyle(native).transform).toBe('none');
        expect(getComputedStyle(container).transform).not.toBe('none');
        const bounds = getScrim(upper).getBoundingClientRect();
        expect(bounds.x).toBe(0);
        expect(bounds.y).toBe(0);
        expect(bounds.width).toBe(window.innerWidth);
        expect(bounds.height).toBe(window.innerHeight);
      }
      for (const animation of animations) {
        animation.finish();
      }
      await transition;
    };
    await checkTransition(upper.show());
    await checkTransition(upper.close());
    expect(lower.open).toBeTrue();
  });

  it('dismisses only the upper dialog and restores focus to the lower dialog', async () => {
    await lower.show();
    const previousFocus = lower.querySelector('button')!;
    previousFocus.focus();
    await upper.show();
    expect(document.activeElement).toBe(upper.querySelector('button'));
    const closed = new Promise<void>((resolve) => {
      upper.addEventListener('closed', () => resolve(), {once: true});
    });
    getNativeDialog(upper).click();
    await closed;
    expect(upper.open).toBeFalse();
    expect(lower.open).toBeTrue();
    expect(document.activeElement).toBe(previousFocus);
  });

  it('preserves cancel prevention for the upper dialog', async () => {
    await lower.show();
    await upper.show();
    upper.addEventListener('cancel', (event) => event.preventDefault());
    getNativeDialog(upper).click();
    expect(upper.open).toBeTrue();
    expect(lower.open).toBeTrue();
  });
});
