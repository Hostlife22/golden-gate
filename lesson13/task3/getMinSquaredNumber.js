export default function getMinSquaredNumber(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return null;
    }

    const numberArray = arr.map((num) => Math.abs(num));
    const minNumber = Math.min(...numberArray);

    return minNumber * minNumber;
}
