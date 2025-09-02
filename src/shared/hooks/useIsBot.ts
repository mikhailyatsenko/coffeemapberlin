import { useEffect, useState } from 'react';

/**
 * Hook to detect if the current user is a search engine bot
 * @returns boolean indicating if the user is a bot
 */
export const useIsBot = (): boolean => {
  const [isBot, setIsBot] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Common search engine bot patterns
    const botPatterns = [
      'googlebot',
      'bingbot',
      'slurp', // Yahoo
      'duckduckbot',
      'baiduspider',
      'yandexbot',
      'facebookexternalhit',
      'twitterbot',
      'linkedinbot',
      'whatsapp',
      'telegrambot',
      'applebot',
      'crawler',
      'spider',
      'bot',
      'crawl',
    ];

    const isBotUserAgent = botPatterns.some((pattern) => userAgent.includes(pattern));

    // Also check for server-side rendering (Next.js, etc.)
    const isSSR = typeof window === 'undefined';

    setIsBot(isBotUserAgent || isSSR);
  }, []);

  return isBot;
};
