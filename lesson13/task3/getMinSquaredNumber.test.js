import getMinSquaredNumber from './getMinSquaredNumber';

it('Should get null if you pass an empty array', () => {
    const minSquaredNumber = getMinSquaredNumber([]);

    expect(minSquaredNumber).toEqual(null);
});

it('Should get null if you pass a string instead of an array', () => {
    const minSquaredNumber = getMinSquaredNumber('str');

    expect(minSquaredNumber).toEqual(null);
});

it('Should get the minimum squared number', () => {
    const minSquaredNumber = getMinSquaredNumber([-777, 3, -2, 6, 45, -20]);

    expect(minSquaredNumber).toEqual(4);
});
