const express = require("express")
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const personsLength = persons.length
    const personsAmountString = personsLength == 1 ?
                                `Phonebook has info for 1 person` :
                                `Phonebook has info for ${personsLength} people`

    const currentDate = new Date()

    response.send(`${personsAmountString}<br>${currentDate}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    console.log(id)
    const person = persons.find(person => person.id == id)
    
    if (!person){
        return response.status(401).end()
    }
    
    response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const getNewId = () => String(Math.floor(Math.random() * 9999))

app.post('/api/persons', (request, response) => {

    if (!request.body.name) {
        return response.status(400).json({error: "name is missing"})
    }

    if (!request.body.number) {
        return response.status(400).json({error: "number is missing"})
    }

    if (persons.filter(person => person.name == request.body.name).length > 0) {
        return response.status(400).json({error: `Person with name ${request.body.name} is already in the book`})
    }

    const newPerson = {
        name: request.body.name,
        number: request.body.number,
        id: getNewId()
    }

    persons = persons.concat(newPerson)

    response.json(persons)
})

const unknownEndPoint = (request, response, next) => {
    response.status(404).json({error: "unknown endpoint"})
}

app.use(unknownEndPoint)

PORT = 3001

app.listen(PORT)

console.log(`App is listening on port: ${PORT}`)