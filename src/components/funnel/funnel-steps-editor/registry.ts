import invariant from 'tiny-invariant';
// TYPES
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

export type FunnelPagesEntry = { funnelPageId: string; entry: HTMLElement };

export function createRegistry() {
  const funnelPages = new Map<string, HTMLElement>();

  const registerFunnelPage = ({ funnelPageId, entry }: FunnelPagesEntry): CleanupFn => {
    funnelPages.set(funnelPageId, entry)
    return () => {
      funnelPages.delete(funnelPageId)
    }
  }

  function getFunnelPageElement(funnelPageId: string) {
    const entry = funnelPages.get(funnelPageId)
    invariant(entry)
    return entry
  }

  return { registerFunnelPage, getFunnelPageElement };
}