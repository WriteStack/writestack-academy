const PROMOTION_COOKIE_NAME = "writestack-academy-promotion";
const COOKIE_MAX_AGE_DAYS = 30;

export type PromotionCookieData = {
  userId: string;
  freeTrialDays: number;
};

export const setPromotionCookie = (data: PromotionCookieData): void => {
  if (typeof document === "undefined") return;

  const value = encodeURIComponent(JSON.stringify(data));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${PROMOTION_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getPromotionCookie = (): PromotionCookieData | null => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${PROMOTION_COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;

  try {
    return JSON.parse(decodeURIComponent(match[1])) as PromotionCookieData;
  } catch {
    return null;
  }
};

export const clearPromotionCookie = (): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${PROMOTION_COOKIE_NAME}=; path=/; max-age=0`;
};
