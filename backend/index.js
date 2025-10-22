require('dotenv').config()
const express = require("express")
const app = express()
const Person = require('./modules/person')

app.use(express.static('dist'))
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
    Person.find({}).then(result => {
        response.json(result)
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {

    Person.find({}).then(persons => {
        console.log(persons)

        const personsLength = persons.length
        const personsAmountString = personsLength == 1 ?
                                    `Phonebook has info for 1 person` :
                                    `Phonebook has info for ${personsLength} people`

        const currentDate = new Date()

        response.send(`${personsAmountString}<br>${currentDate}`)
    }).catch(error => next(error))
    
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(
        person => {
            if (!person){
                return response.status(401).end()
            }
            
            response.json(person)
        }
    ).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(
        result => response.status(204).end()
    ).catch(error => next(error))
    
})

const getNewId = () => String(Math.floor(Math.random() * 9999))

app.post('/api/persons', (request, response, next) => {

    // if (!request.body.name) {
    //     return response.status(400).json({error: "name is missing"})
    // }

    // if (!request.body.number) {
    //     return response.status(400).json({error: "number is missing"})
    // }

    // if (persons.filter(person => person.name == request.body.name).length > 0) {
    //     return response.status(400).json({error: `Person with name ${request.body.name} is already in the book`})
    // }

    const newPerson = {
        name: request.body.name,
        number: request.body.number,
        // id: getNewId()
    }

    const mongoNewPerson = new Person(newPerson)
    
    mongoNewPerson.save()
                    .then(
                        result => {
                            persons = persons.concat(newPerson)

                            return Person.find({})
                        }
                    )
                    .then(
                        result => response.json(result)
                    )
                    .catch(error => next(error))


})


app.put('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(
            person => {

                if(!person) {
                    return response.status(404).end()
                }

                person.name = request.body.name
                person.number = request.body.number

                return person.save()
            }
        )
        .then(
            result => response.json(result) 
        )
        .catch(error => next(error))
})

const unknownEndPoint = (request, response, next) => {
    response.status(404).json({error: "unknown endpoint"})
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    
    if (error.name = 'ValidatorError') {
        return response.status(400).json(error)
    }

    next(error)
}

PORT = process.env.PORT

app.use(errorHandler)

app.listen(PORT)


console.log(`App is listening on port: ${PORT}`)