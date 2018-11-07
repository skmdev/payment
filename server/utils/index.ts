import uniqid from 'uniqid';
import creditCardType from 'credit-card-type';
import valid from 'card-validator';

export function getReferenceNumber() {
  return uniqid().toLocaleUpperCase();
}

export function isCreditCardValid(cardNumber: string) {
  return valid.number(cardNumber).isValid;
}

export function prettyCardNumber(cardNumber: string) {
  const cardInfo = creditCardType(cardNumber)[0];
  if (!cardInfo) {
    return cardNumber;
  }
  var card = creditCardType.getTypeInfo(cardInfo.type);

  if (card) {
    var offsets = [].concat(0, card.gaps, cardNumber.length);
    var components = [];

    for (var i = 0; offsets[i] < cardNumber.length; i++) {
      var start = offsets[i];
      var end = Math.min(offsets[i + 1], cardNumber.length);
      components.push(cardNumber.substring(start, end));
    }

    return components.join(' ');
  }

  return cardNumber;
}

export function getAvailableYear() {
  return [ ...Array(11) ].map((_, index) => index + new Date().getFullYear() % 100);
}

export function getAvailableMonth() {
  return [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
}
