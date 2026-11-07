import { FormEvent, useRef, useState } from 'react';
import { createAd } from '../services/api';

interface AdFormProps {
  onPublished: () => Promise<void>;
  currency: string;
}

export function AdForm({ onPublished, currency }: AdFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    const numericPrice = Number(price);

    if (!title.trim() || !description.trim() || !price.trim()) {
      setError('Заполните название, описание и цену.');
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Цена должна быть положительным числом.');
      return;
    }

    setSending(true);
    try {
      await createAd({ title: title.trim(), description: description.trim(), price: numericPrice, image });
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      if (fileInput.current) fileInput.current.value = '';
      setSuccess('Объявление успешно опубликовано.');
      await onPublished();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось опубликовать объявление.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="publish-section" id="publish">
      <div>
        <p className="eyebrow">Ваше объявление</p>
        <h2>Разместить объявление</h2>
        <p className="section-lead">Расскажите о товаре кратко и добавьте фотографию.</p>
      </div>
      <form className="ad-form" onSubmit={handleSubmit}>
        <label>Название<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например, Велосипед" disabled={sending} /></label>
        <label>Описание<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Состояние, особенности, срок использования" rows={4} disabled={sending} /></label>
        <div className="form-grid">
          <label>{currency === 'KGS' ? 'Цена, сом' : currency === 'KZT' ? 'Цена, ₸' : currency === 'RUB' ? 'Цена, ₽' : 'Цена, $'}<input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="1" step="0.01" inputMode="decimal" placeholder="0" disabled={sending} /></label>
          <label>Фото<input ref={fileInput} onChange={(e) => setImage(e.target.files?.[0] ?? null)} type="file" accept="image/*" disabled={sending} /></label>
        </div>
        {error && <p className="message message--error" role="alert">{error}</p>}
        {success && <p className="message message--success" role="status">{success}</p>}
        <button className="button button--primary" type="submit" disabled={sending}>
          {sending ? 'Публикуем…' : 'Опубликовать'}
        </button>
      </form>
    </section>
  );
}
