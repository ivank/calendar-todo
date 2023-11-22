import { FormatRegistry } from '@sinclair/typebox';

// -------------------------------------------------------------------------------------------
// Format Registration
// -------------------------------------------------------------------------------------------
FormatRegistry.Set('date', (value) => IsDate(value));
FormatRegistry.Set('uri', (value) => URI.test(value));
FormatRegistry.Set('email', (value) => EMAIL.test(value));

// -------------------------------------------------------------------------------------------
// https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
// -------------------------------------------------------------------------------------------

const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function IsLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function IsDate(str: string): boolean {
  const matches: string[] | null = DATE.exec(str);
  if (!matches) return false;
  const year: number = +matches[1];
  const month: number = +matches[2];
  const day: number = +matches[3];
  return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month]);
}

const URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i;
const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
