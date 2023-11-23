import { FormatRegistry } from '@sinclair/typebox';

// -------------------------------------------------------------------------------------------
// Format Registration
// -------------------------------------------------------------------------------------------
FormatRegistry.Set('date', (value) => DATE.test(value));
FormatRegistry.Set('date-time', (value) => DATE_TIME.test(value));
FormatRegistry.Set('uri', (value) => URI.test(value));
FormatRegistry.Set('email', (value) => EMAIL.test(value));

// -------------------------------------------------------------------------------------------
// https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
// -------------------------------------------------------------------------------------------

const DATE = /^\d\d\d\d-[0-1]\d-[0-3]\d$/;
const DATE_TIME = /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i;
const URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i;
const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
