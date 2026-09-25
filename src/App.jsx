import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, decrementItem, removeItem } from './store/cartSlice';
import { products } from './data/products';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.cart.items.find((item) => item.id === product.id)?.quantity || 0);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.color}</p>
        </div>
        <strong>{money.format(product.price)}</strong>
      </div>
      <button className="add-button" type="button" onClick={() => dispatch(addItem(product))}>
        {quantity ? `Added · ${quantity}` : 'Add to cart'}
      </button>
    </article>
  );
}

function CartView({ onContinue }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!items.length) {
    return (
      <section className="empty-cart">
        <span className="empty-mark">○</span>
        <p className="eyebrow">Your cart is quiet</p>
        <h2>Nothing collected yet.</h2>
        <button className="dark-button" type="button" onClick={onContinue}>Browse the collection</button>
      </section>
    );
  }

  return (
    <section className="cart-layout">
      <div>
        <div className="section-heading compact-heading">
          <p className="eyebrow">Your selection</p>
          <h2>{totalItems} {totalItems === 1 ? 'object' : 'objects'}</h2>
        </div>
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt="" />
              <div className="cart-item-copy"><h3>{item.name}</h3><p>{money.format(item.price)} · {item.color}</p></div>
              <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => dispatch(decrementItem(item.id))}>−</button>
                <span>{item.quantity}</span>
                <button type="button" aria-label={`Increase ${item.name}`} onClick={() => dispatch(addItem(item))}>+</button>
              </div>
              <button className="remove-button" type="button" onClick={() => dispatch(removeItem(item.id))}>Remove</button>
            </article>
          ))}
        </div>
      </div>
      <aside className="summary-panel">
        <p className="eyebrow">Summary</p>
        <div className="summary-row"><span>Subtotal</span><strong>{money.format(total)}</strong></div>
        <div className="summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div className="summary-total"><span>Total</span><strong>{money.format(total)}</strong></div>
        <button className="dark-button full-button" type="button">Continue to checkout</button>
      </aside>
    </section>
  );
}

function App() {
  const [view, setView] = useState('shop');
  const itemCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setView('shop')}><span>F/F</span> Form & Field</button>
        <nav aria-label="Main navigation">
          <button className={view === 'shop' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setView('shop')}>Collection</button>
          <button className={view === 'cart' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setView('cart')}>Cart <span className="cart-count">{itemCount}</span></button>
        </nav>
      </header>
      <main>
        {view === 'shop' ? (
          <>
            <section className="hero">
              <div><p className="eyebrow">Collection 01 / Everyday rituals</p><h1>Objects with<br /><em>a point of view.</em></h1></div>
              <div className="hero-note"><span>↓</span><p>Small-batch goods for<br />slow, considered living.</p></div>
            </section>
            <section className="collection-section">
              <div className="section-heading"><p className="eyebrow">The edit</p><h2>Useful, tactile,<br />quietly distinctive.</h2></div>
              <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            </section>
          </>
        ) : <CartView onContinue={() => setView('shop')} />}
      </main>
      <footer><span>FORM & FIELD / 2024</span><span>Made for the everyday.</span></footer>
    </div>
  );
}

export default App;