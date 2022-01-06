//  1 Вариант решения

const getTwodigitNumber = number => {
  const digitOfNumbers = String(number);
  if (digitOfNumbers.length === 1) {
    return getUniqValues(number);
  }

  const decimalPlace = digitOfNumbers[0] + 0;
  const singleDigit = digitOfNumbers[1];

  return number <= 20
    ? getUniqValues(number)
    : getUniqValues(decimalPlace) + ' ' + getUniqValues(singleDigit);
};

function toReadable(number) {
  if (number < 100) {
    return getTwodigitNumber(number);
  }

  const stringFormat = String(number);
  const hundredths = getTwodigitNumber(stringFormat[0]) + ' hundred';

  return +stringFormat.slice(1) === 0
    ? hundredths
    : hundredths + ' ' + getTwodigitNumber(stringFormat.slice(1));
}

function getUniqValues(number) {
  switch (+number) {
    case 0:
      return 'zero';
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    case 6:
      return 'six';
    case 7:
      return 'seven';
    case 8:
      return 'eight';
    case 9:
      return 'nine';
    case 10:
      return 'ten';
    case 11:
      return 'eleven';
    case 12:
      return 'twelve';
    case 13:
      return 'thirteen';
    case 14:
      return 'fourteen';
    case 15:
      return 'fifteen';
    case 16:
      return 'sixteen';
    case 17:
      return 'seventeen';
    case 18:
      return 'eighteen';
    case 19:
      return 'nineteen';
    case 20:
      return 'twenty';
    case 30:
      return 'thirty';
    case 40:
      return 'forty';
    case 50:
      return 'fifty';
    case 60:
      return 'sixty';
    case 70:
      return 'seventy';
    case 80:
      return 'eighty';
    default:
      return 'ninety';
  }
}

console.log(toReadable(999));

//  2 Вариант решения
const numbers = {
  single: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  doubleDigit: [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ],
  digitNumbers: [
    'zero',
    'ten',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ],
};

const getTwodigitNumber2 = number => {
  const digitOfNumbers = String(number);
  if (digitOfNumbers.length === 1) {
    return numbers.single[number];
  }

  return number < 20
    ? numbers.doubleDigit[digitOfNumbers[1]]
    : +digitOfNumbers.slice(1) === 0
    ? numbers.digitNumbers[digitOfNumbers[0]]
    : numbers.digitNumbers[digitOfNumbers[0]] + ' ' + numbers.single[digitOfNumbers[1]];
};

function toReadable2(number) {
  if (number < 100) {
    return getTwodigitNumber2(number);
  }

  const stringFormat = String(number);
  const hundredths = numbers.single[stringFormat[0]] + ' hundred';

  return +stringFormat.slice(1) === 0
    ? hundredths
    : hundredths + ' ' + getTwodigitNumber2(stringFormat.slice(1));
}

console.log(toReadable2(101));
