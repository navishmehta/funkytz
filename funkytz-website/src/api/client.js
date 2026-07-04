const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),
  getCategories: () => request('/categories'),
  getReviews: (productIdOrSlug) => {
    const qs = productIdOrSlug ? `?product=${encodeURIComponent(productIdOrSlug)}` : '';
    return request(`/reviews${qs}`);
  },
};

export default api;
