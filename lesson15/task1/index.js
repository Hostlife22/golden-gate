/* eslint-disable max-classes-per-file */

class User {
    constructor(id, name, sessionId) {
        this._id = id;
        this._name = name;
        this._sessionId = sessionId;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }

    get sessionId() {
        return this._sessionId;
    }
}

class UserRepository {
    constructor(users) {
        this._users = Object.freeze(users);
    }

    get users() {
        return this._users;
    }

    getUserNames() {
        return this._users.map((obj) => obj._name);
    }

    getUserId() {
        return this._users.map((obj) => obj._id);
    }

    getUserNameById(id) {
        const userIdArray = this.getUserId();
        const userNamesArray = this.getUserNames();

        return userNamesArray[userIdArray.indexOf(String(id))];
    }
}

// examples
const user = new User('1', 'Tom', 'session-id');
const user2 = new User('2', 'Bob', 'session-2id');

// получить свойства можем
console.log(user.id); // ===> '1'
console.log(user.name); // ===> 'Tom'
console.log(user.sessionId); // ===> 'session-id'

// но изменить эти свойства нельзя
// user.name = 'Bob'; // пытаемся изменить старое значение
// console.log(user.name); // ===> 'Tom' - но изменение проигнорировано, так как setter отсутствует

const repo = new UserRepository([user, user2]);
console.log(repo);
console.log(repo.getUserNames());
console.log(repo.getUserId());
console.log(repo.getUserNameById(2));
