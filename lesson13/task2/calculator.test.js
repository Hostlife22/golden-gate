import sum, { getSquaredArray, getOddNumbers } from './calculator.js';

it('Should get squared array ', () => {
    const result = getSquaredArray([1, 2, 3, 4]);

    expect(result).toEqual([1, 4, 9, 16]);
});

it('Should get odd array ', () => {
    const result = getOddNumbers([1, 2, 3, 4]);

    expect(result).toEqual([1, 3]);
});

it('Should the sum of numbers  ', () => {
    const result = sum(10, 14);

    expect(result).toEqual(24);
});
