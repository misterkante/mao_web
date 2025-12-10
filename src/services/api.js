import { supabase } from './supabase';

const API_BASE_URL =
 import.meta.env.VITE_API_URL || 'https://mao-code.netlify.app/api';

  console.log(API_BASE_URL)
export const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session?.access_token || null;
};

export const apiRequest = async (path, { method = 'GET', body, token } = {}) => {
  const accessToken = token || (await getAccessToken());
  if (!accessToken) {
    throw new Error('Authentication required');
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = payload?.message || payload?.error || res.statusText;
    throw new Error(message);
  }

  return payload;
};

