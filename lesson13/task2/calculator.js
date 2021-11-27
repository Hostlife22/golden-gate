export function getSquaredArray(arr) {
    return arr.map((num) => num * num);
}

export function getOddNumbers(arr) {
    return arr.filter((num) => num % 2 === 1);
}

export default function sum(a, b) {
    return a + b;
}
