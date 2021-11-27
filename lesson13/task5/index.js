export function reverseString(str) {
    if (typeof str !== 'string') {
        return null;
    }

    return str.split('').reverse().join('');
}

export function withdraw(clients, balances, client, amount) {
    const indexOfElement = clients.indexOf(client);

    return balances[indexOfElement] - amount > 0
        ? balances[indexOfElement] - amount
        : -1;
}

export function getAdults(obj) {
    const filteredObj = {};

    for (const key in obj) {
        if (obj[key] >= 18) {
            filteredObj[key] = obj[key];
        }
    }

    return filteredObj;
}
