import { useCallback, useEffect, useState } from 'react';
import { AdForm } from './components/AdForm';
import { AdCard } from './components/AdCard';
import { getAds } from './services/api';
import type { Ad } from './types/Ad';

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('KGS');
  const [error, setError] = useState('');

  const loadAds = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAds();
      setAds(data.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить объявления.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAds();
  }, [loadAds]);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">Доска объявлений</a>
          <div className="header-actions">
            <label className="currency-picker">
              <span>Валюта</span>
              <select value={currency} onChange={(event) => setCurrency(event.target.value)} aria-label="Выбрать валюту">
                <option value="KGS">сом</option>
                <option value="KZT">₸</option>
                <option value="RUB">₽</option>
                <option value="USD">$</option>
              </select>
            </label>
            <a className="button button--small" href="#publish">Разместить объявление</a>
          </div>
        </div>
      </header>
      <main id="top" className="container">
        <AdForm onPublished={loadAds} currency={currency} />
        <section className="ads-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Свежие предложения</p>
              <h2>Последние объявления</h2>
            </div>
          </div>

          {loading && <div className="state" role="status"><span className="spinner" />Загружаем объявления…</div>}
          {!loading && error && (
            <div className="state state--error" role="alert">
              <p>{error}</p>
              <button className="button" type="button" onClick={() => void loadAds()}>Повторить</button>
            </div>
          )}
          {!loading && !error && ads.length === 0 && <div className="state">Пока нет объявлений. Будьте первым!</div>}
          {!loading && !error && ads.length > 0 && (
            <div className="ads-grid">
              {ads.map((ad) => <AdCard key={ad.id} ad={ad} currency={currency} />)}
            </div>
          )}
        </section>
      </main>
      <footer className="footer container">Доска объявлений · Учебный проект</footer>
    </>
  );
}

export default App;
