let id = 1;
const DB = [{ id: 1, name: 'Juancho', age: 30 }];

module.exports = {
  DB,

  add(user) {
    id++;
    user.id = id;
    DB.push(user);
  },
};
