export function formatSearch(se: string) {
  se = decodeURIComponent(se);
  se = se.substr(1);
  const arr = se.split('&');
  const obj: Record<string, string> = {};
  let newarr = [];

  arr.forEach(v => {
    newarr = v.split('=');
    if (typeof obj[newarr[0]] === 'undefined') {
      obj[newarr[0]] = newarr[1];
    }
  });

  return obj;
}
