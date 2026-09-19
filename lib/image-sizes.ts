// Fallback for browsers without lazy-image auto sizing: a full-width mobile
// card, then either a paired card or the larger lead story on desktop.
export const cardImageSizes =
  '(max-width: 760px) calc(100vw - 40px), (max-width: 1000px) calc(50vw - 42px), (max-width: 1296px) calc(60vw - 58px), 700px';
