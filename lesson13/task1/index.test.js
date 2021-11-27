it('Should the number 17 be 17', () => {
    expect(17).toEqual(17);
});

it('Should the number 17 not equal 18', () => {
    expect(17).not.toEqual(18);
});

const getEvenNumbers = (arr) => arr.filter((num) => num % 2 === 0);

it('Shoud array of even numbers', () => {
    const result = getEvenNumbers([1, 2, 3, 4]);

    expect(result).toEqual([2, 4]);
});
