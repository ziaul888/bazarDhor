const STORAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

export const resolveBrandImage = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return `${STORAGE_BASE_URL}${trimmed}`;
};

export const getBrandInitial = (name: unknown, fallback = 'M'): string => {
  if (typeof name !== 'string') {
    return fallback;
  }

  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : fallback;
};
