import type { AdsResponse, Ad } from '../types/Ad';

export const API_URL = 'https://inai-col1.fishrungames.com/ads';
export const UPLOADS_BASE_URL = 'https://inai-col1.fishrungames.com';

async function readError(response: Response): Promise<string> {
  const data = await response.text();
  if (!data) return `Ошибка сервера (${response.status})`;
  try {
    const parsed = JSON.parse(data) as { message?: string; detail?: string };
    return parsed.message || parsed.detail || `Ошибка сервера (${response.status})`;
  } catch {
    return data.slice(0, 180);
  }
}

export async function getAds(): Promise<AdsResponse> {
  let response: Response;
  try {
    response = await fetch(API_URL);
  } catch {
    throw new Error('Не удалось подключиться к серверу. Проверьте интернет-соединение и настройку CORS API.');
  }
  if (!response.ok) throw new Error(await readError(response));
  const data = await response.json() as AdsResponse;
  if (!Array.isArray(data.items)) throw new Error('Сервер вернул объявление в неожиданном формате.');
  return data;
}

export interface NewAd {
  title: string;
  description: string;
  price: number;
  image: File | null;
}

export async function createAd(ad: NewAd): Promise<Ad> {
  const body = new FormData();
  body.append('title', ad.title);
  body.append('description', ad.description);
  body.append('price', String(ad.price));
  if (ad.image) body.append('image', ad.image);

  let response: Response;
  try {
    response = await fetch(API_URL, { method: 'POST', body });
  } catch {
    throw new Error('Не удалось отправить объявление. Проверьте интернет-соединение и настройку CORS API.');
  }
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<Ad>;
}
