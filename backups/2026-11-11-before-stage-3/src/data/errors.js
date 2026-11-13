/** A data problem the interface can explain: NOT_FOUND, NETWORK, HTTP or INVALID. */
export class DataError extends Error {
  constructor(message, code = 'INVALID') {
    super(message);
    this.name = 'DataError';
    this.code = code;
  }
}
