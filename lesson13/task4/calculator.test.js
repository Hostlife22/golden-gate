import { calc } from './calculator.js';

it('Should get the sum of 2 numbers', () => {
    const result = calc('2 + 12');

    expect(result).toEqual('2 + 12 = 14');
});

it('Should get the subtraction of 2 numbers', () => {
    const result = calc('103 - 53');

    expect(result).toEqual('103 - 53 = 50');
});

it('Should get the multiplications of 2 numbers', () => {
    const result = calc('11 * 10');

    expect(result).toEqual('11 * 10 = 110');
});

it('Should get the divisions of 2 numbers', () => {
    const result = calc('81 / 9');

    expect(result).toEqual('81 / 9 = 9');
});

it('Should get null if you entered a non-string', () => {
    const result = calc(12 / 2);

    expect(result).toEqual(null);
});
