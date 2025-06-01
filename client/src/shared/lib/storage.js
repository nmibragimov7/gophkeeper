const storage = (key) => ({
  _value: null,
  save(data) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },
  get() {
    if (typeof localStorage !== "undefined") {
      const data = localStorage.getItem(key) !== "undefined" ? localStorage.getItem(key) : "null";
      this._value = JSON.parse(data);
      return this._value;
    }
    return null;
  },
  clear() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
});

export const accessTokenStorage = storage('access');
export const userStorage = storage('user');
export default storage;
