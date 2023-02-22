function isEven(number) {
  return number % 2 == 0;
}
const myNumber = 23456;
const isMyNumberEven = isEven(myNumber);
console.log(isMyNumberEven);

const person = {
  name: "mopeno",
  pass: "Winds",
};
const personToJson = JSON.stringify(person);
console.log(personToJson);
