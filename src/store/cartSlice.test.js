import { describe, expect, it } from 'vitest';
import reducer, { addItem, decrementItem, removeItem } from './cartSlice';

const product = { id: 'mug', name: 'Mug', price: 32, color: 'White' };

describe('cart reducer', () => {
  it('adds an item and increments quantity for duplicates', () => {
    let state = reducer(undefined, addItem(product));
    state = reducer(state, addItem(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes an item when decrementing its last quantity', () => {
    const state = reducer({ items: [{ ...product, quantity: 1 }] }, decrementItem(product.id));
    expect(state.items).toEqual([]);
  });

  it('removes an item directly', () => {
    const state = reducer({ items: [{ ...product, quantity: 2 }] }, removeItem(product.id));
    expect(state.items).toEqual([]);
  });
});