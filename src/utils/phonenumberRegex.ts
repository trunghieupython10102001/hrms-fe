export const phoneNumberRegex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export function removeAllNonDigits(amount: string) {
  const notNumberRegex = /[^\d]/g;
  const removedSpecialCharacterAmount = amount.replace(notNumberRegex, '');

  return removedSpecialCharacterAmount;
}
