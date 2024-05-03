export const JSONParseOrNull: (possiblyString: any) => string | null = (
  possiblyString
) => {
  if (!possiblyString || typeof possiblyString !== 'string') return null;

  try {
    return JSON.parse(possiblyString);
  } catch {
    return null;
  }
};
