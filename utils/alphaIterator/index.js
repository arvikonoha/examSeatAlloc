module.exports = function*() {
  let asciiForA = 65;
  for (let i = 0; i < 26; ++i, ++asciiForA) {
    yield asciiForA;
  }
};
