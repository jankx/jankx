import { MmenuStateManager } from '../src/core/state/state-manager';
import { ObserverController } from '../src/core/state/observer-controller-fixed';

describe('ObserverController', () => {
  let manager: MmenuStateManager;
  let controller: ObserverController;
  let menuElement: HTMLElement;
  let panelsElement: HTMLElement;

  beforeEach(() => {
    // Ensure MutationObserver exists in JSDOM
    // @ts-ignore
    global.MutationObserver = window.MutationObserver || global.MutationObserver;

    manager = new MmenuStateManager(
      { slidingSubmenus: true },
      {
        classNames: {
          panel: 'mm-panel',
          nopanel: 'mm-nopanel',
          nolistview: 'mm-nolistview',
          divider: 'mm-divider',
          vertical: 'mm-vertical',
          selected: 'mm-listitem--selected',
        },
        panelNodetype: ['div', 'section', 'article'],
        screenReader: {
          openMenu: 'Open menu',
          closeMenu: 'Close menu',
          toggleSubmenu: 'Toggle submenu',
          openSubmenu: 'Open submenu',
        },
      }
    );

    menuElement = document.createElement('nav');
    panelsElement = document.createElement('div');
    document.body.appendChild(menuElement);
    document.body.appendChild(panelsElement);

    manager.setState({ menuElement, panelsElement });
    controller = new ObserverController(manager);
  });

  afterEach(() => {
    controller.destroy();
    document.body.innerHTML = '';
  });

  it('initializes observers and stores them in state', () => {
    controller.initialize();
    const observers = manager.getState().observers;
    expect(observers.panel).toBeTruthy();
    expect(observers.listview).toBeTruthy();
    expect(observers.listitem).toBeTruthy();
  });
});
