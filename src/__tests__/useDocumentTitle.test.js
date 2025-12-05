import { renderHook } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach } from 'vitest';
import useDocumentTitle from '../hooks/useDocumentTitle';

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'Test';
  });

  it('should set document title', () => {
    renderHook(() => useDocumentTitle('New Title'));
    expect(document.title).toBe('New Title');
  });

  it('should update document title when title changes', () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: 'Initial Title' }
    });
    
    expect(document.title).toBe('Initial Title');
    
    rerender({ title: 'Updated Title' });
    expect(document.title).toBe('Updated Title');
  });
});