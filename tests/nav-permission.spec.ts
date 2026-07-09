import { describe, it, expect, beforeEach, vi } from 'vitest';

// The nav registry is a singleton; capture what the plugin registers in activate().
const registered: Array<Record<string, unknown>> = [];

vi.mock('@/plugins/userNavRegistry', () => ({
  userNavRegistry: {
    register: (item: Record<string, unknown>) => registered.push(item),
    unregister: vi.fn(),
  },
}));

import { tarotPlugin } from '../index';

describe('tarot nav item permission gate', () => {
  beforeEach(() => {
    registered.length = 0;
  });

  it('gates the burger-menu entry behind tarot.reading.view', () => {
    tarotPlugin.activate?.();

    expect(registered).toHaveLength(1);
    expect(registered[0].pluginName).toBe('tarot');
    expect(registered[0].requiredUserPermission).toBe('tarot.reading.view');
  });
});
