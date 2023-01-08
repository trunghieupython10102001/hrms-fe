export function sleep(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

export function extractFIleNameFromURL(filename: string) {
  const url = new URL(filename);
  const name = url.pathname.split('/').at(-1) || '';

  return name;
}
