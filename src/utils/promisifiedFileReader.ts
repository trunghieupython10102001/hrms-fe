/**
 * Promisified FileReader
 * More info https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 * @param {*} file
 * @param {*} method: readAsArrayBuffer, readAsBinaryString, readAsDataURL, readAsText
 */
export const readFileAsync = (
  file: File,
  method: 'readAsArrayBuffer' | 'readAsBinaryString' | 'readAsDataURL' | 'readAsText',
) => {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader[method](file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
  });
};
