import { MmenuStateManager } from '../src/core/state/state-manager';

describe('MmenuStateManager', () => {
  let manager: MmenuStateManager;

  beforeEach(() => {
    manager = new MmenuStateManager({}, {});
  });

  it('updates state and emits stateChange', () => {
    const spy = jest.fn();
    manager.subscribe('stateChange', spy);
    manager.setState({ isOpen: true, currentPanel: 'panel-1' });
    const state = manager.getState();
    expect(state.isOpen).toBe(true);
    expect(state.currentPanel).toBe('panel-1');
    expect(spy).toHaveBeenCalled();
  });

  it('opens and closes panel updating state correctly', () => {
    manager.setState({ menuElement: document.createElement('div'), panelsElement: document.createElement('div') });
    manager.openPanel('panel-a');
    let state = manager.getState();
    expect(state.currentPanel).toBe('panel-a');
    expect(state.openedPanels.includes('panel-a')).toBe(true);
    manager.closePanel('panel-a');
    state = manager.getState();
    expect(state.openedPanels.includes('panel-a')).toBe(false);
    expect(state.currentPanel).toBe(null);
  });

  it('selects item and toggles menu open/close', () => {
    manager.setSelected('item-1');
    let state = manager.getState();
    expect(state.selectedItems).toEqual(['item-1']);
    manager.openMenu();
    state = manager.getState();
    expect(state.isOpen).toBe(true);
    manager.closeMenu();
    state = manager.getState();
    expect(state.isOpen).toBe(false);
    expect(state.openedPanels.length).toBe(0);
  });
});
