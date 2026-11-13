let test = require("./people");

console.log(test.people);
console.log(test.age);
test.people.forEach((name, index) => {
  console.log(name, test.age[index]);
});
