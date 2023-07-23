export function debounce(callback: Function, wait = 300) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), wait);
  };
}
