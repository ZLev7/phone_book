
const test_arr = [1, 3, 5, 6]

const new_test_arr = test_arr.concat(0).map(value => `<li>${value * 2 + 1}<li/>`)


const [first, second, ...rest] = new_test_arr

// console.log(first)
// console.log(second)
// console.log(rest)

const log_value = (value) => {console.log(value)}

// new_test_arr.forEach(value => log_value(value))


const thisIsJSObject = {
    name: 'Yhwatch',
    age: '1001'
}

thisIsJSObject.occupation= 'Quincy King'
thisIsJSObject['enemies'] = 'Shinigami'

// console.log(`Name: ${thisIsJSObject.name}`)
// console.log(`Age: ${thisIsJSObject.age}`)
// console.log(`Occupation: ${thisIsJSObject['occupation']}`)
// console.log(`Enemies: ${thisIsJSObject.enemies}`)

const single_param_f = param => {return param + 1}

const simple_f = param => param * 2

// console.log(simple_f('5'))


const new_obj = {
    name: 'new obj',
    age: 23,
    cat: 'inn',
    greet: function(name) {return `Hi! My name is ${this.name}! I am happy to see you, ${name}`} 
}

new_obj.get_older = function(years) {
    return this.age + years
}

console.log(new_obj.greet('Mike'))
console.log(new_obj.get_older(5))