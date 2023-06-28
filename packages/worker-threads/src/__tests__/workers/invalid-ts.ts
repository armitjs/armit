// On purpose invalid ts
module.exports = {
  // @ts-ignore
  getNestedValue: (val: object) => val + 1,
};
