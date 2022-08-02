import currency from 'currency.js';

export const BRL = (value: any) =>
  currency(value, { symbol: 'R$', separator: '.', decimal: ',', precision: 2 });

export const stringToFloat = (value: string): string | null => {
  const number = currency(value.toString().replace(/[^\d]/g, ''), {
    fromCents: true,
    precision: 2,
  });
  if (!isNaN(number.value)) {
    return number.value.toString();
  }

  return null;
};

export const currencyToDecimal = (string: any): any => {
  if (string) {
    return BRL(string);
  }
  return null;
};
