import * as uniqid from 'uniqid';

export function a() {
  return 'haha';
}

export function getReferenceNumber() {
  return uniqid().toLocaleUpperCase();
}
