import { reverseString, withdraw, getAdults } from './index.js';

// Tests for the reverseString function

it('Should get a string where the characters go in reverse order', () => {
    const reverse = reverseString('Hello');
    expect(reverse).toEqual('olleH');
});

it('Should get an empty string if an empty string is entered', () => {
    const reverse = reverseString('');
    expect(reverse).toEqual('');
});

it('Should get null if you entered a non-string', () => {
    const reverse = reverseString(123421);
    expect(reverse).toEqual(null);
});

// Tests for the withdraw function

it('Should eventually withdraw the money and get the account balance', () => {
    const result = withdraw(
        ['Ann', 'John', 'User'],
        [1400, 87, -6],
        'John',
        50
    );
    expect(result).toEqual(37);
});

it('Should get -1 if there is not enough money', () => {
    const result = withdraw(
        ['Ann', 'John', 'User'],
        [1400, 87, -6],
        'User',
        10
    );
    expect(result).toEqual(-1);
});

it('Should eventually withdraw the money and get the account balance', () => {
    const result = withdraw(
        ['Ann', 'John', 'User'],
        [1400, 87, -6],
        'Ann',
        1210
    );
    expect(result).toEqual(190);
});

// Tests for the getAdults function

it('Should get an object with people who are already 18 years old', () => {
    const filteredObj = getAdults({ 'John Doe': 19, Tom: 17, Bob: 18 });
    expect(filteredObj).toEqual({ 'John Doe': 19, Bob: 18 });
});

it('Should get an object with people who are already 18 years old', () => {
    const filteredObj = getAdults({ Ann: 56, Andrey: 7 });
    expect(filteredObj).toEqual({ Ann: 56 });
});

it('Should get an empty object because there are no adults', () => {
    const filteredObj = getAdults({ Bob: 12, Alex: 7 });
    expect(filteredObj).toEqual({});
});
