require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url)
            .then(
                result => console.log('Successfully connected to mongodb!')
            )
            .catch(
                error => console.log('Error has occured during connection to mongodb: ', error.message)
            )

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: v => v.split('-').length == 2,
            message: props => `${props.value} is not a valid phone number!`
        } 
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)



