import { MmenuStateManager } from '../src/core/state/state-manager';
import { DOMController } from '../src/core/state/dom-controller';

describe('DOMController', () => {
  let manager: MmenuStateManager;
  let domController: DOMController;
  let wrapper: HTMLElement;
  let menuElement: HTMLElement;
  let panelsElement: HTMLElement;
  let panel1: HTMLElement;
  let panel2: HTMLElement;
  let item1: HTMLElement;

  beforeEach(() => {
    manager = new MmenuStateManager(
      { slidingSubmenus: true },
      { classNames: { panel: 'mm-panel', nopanel: 'mm-nopanel', selected: 'mm-listitem--selected' } }
    );

    wrapper = document.createElement('div');
    wrapper.className = 'mm-wrapper';
    document.body.appendChild(wrapper);

    menuElement = document.createElement('nav');
    wrapper.appendChild(menuElement);

    panelsElement = document.createElement('div');
    panelsElement.className = 'mm-panels';
    menuElement.appendChild(panelsElement);

    panel1 = document.createElement('div');
    panel1.id = 'panel-1';
    panel1.className = 'mm-panel mm-panel--opened';
    panelsElement.appendChild(panel1);

    panel2 = document.createElement('div');
    panel2.id = 'panel-2';
    panel2.className = 'mm-panel';
    panelsElement.appendChild(panel2);

    item1 = document.createElement('li');
    item1.id = 'item-1';
    menuElement.appendChild(item1);

    domController = new DOMController(manager);
    domController.initializeElements(menuElement, panelsElement);
  });

  afterEach(() => {
    domController.destroy();
    document.body.innerHTML = '';
  });

  it('initializes state from DOM', () => {
    const state = manager.getState();
    expect(state.menuElement).toBe(menuElement);
    expect(state.panelsElement).toBe(panelsElement);
    expect(state.currentPanel).toBe('panel-1');
    expect(state.openedPanels.includes('panel-1')).toBe(true);
  });

  it('opens panel and updates classes', () => {
    manager.openPanel('panel-2');
    expect(panel2.classList.contains('mm-panel--opened')).toBe(true);
    expect(panel2.getAttribute('inert')).toBeNull();
    expect(panel1.classList.contains('mm-panel--parent') || panel1.classList.contains('mm-panel--highest')).toBe(true);
  });

  it('selects item and toggles selection class', () => {
    manager.setSelected('item-1');
    expect(item1.classList.contains('mm-listitem--selected')).toBe(true);
  });

  it('updates menu open state on wrapper', () => {
    manager.setState({ isOpen: true });
    expect(wrapper.classList.contains('mm-wrapper--open')).toBe(true);
    manager.setState({ isOpen: false });
    expect(wrapper.classList.contains('mm-wrapper--open')).toBe(false);
  });
});
