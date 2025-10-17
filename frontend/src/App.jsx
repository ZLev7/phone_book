import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = '/api/persons'

const Notification = ({message, type}) => {
  if (message === '') {
    return null
  }

  return(
    <div className = {type === 'notification' ? 'notification' : 'error'}>
        {message}
    </div>
  )

}


const Person = ({person, onDelete}) => <p style={{color: 'green', fontStyle: 'italic'}}>{`${person.name} ${person.number}`} <button onClick={onDelete}>Delete</button></p>


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState({
    message: '',
    type: ''
  })


  const getPersons = () => {
    axios.get(baseUrl)
          .then(
            response => {
              const gotPersons = response.data
              console.log(gotPersons)
              setPersons(gotPersons)
            }
          )
  }

  useEffect(getPersons, [])

  const handleSearchChange = (event) => {
    const newSearchChanged = event.target.value
    setNewSearch(newSearchChanged)
  }

  const handleNameChange = (event) => {
  
    const newNameChanged = event.target.value
    setNewName(newNameChanged)

  }

  const handlePhoneChange = (event) => {
    const newPhoneChanged = event.target.value
    setNewPhone(newPhoneChanged)
  }

  const handleSubmitPerson = (event) => {

    event.preventDefault()

    const presentPersons = persons.filter(person => person.name === newName)

    const newPerson = {
        name: newName,
        number: newPhone
      }

    if (presentPersons.length !== 0) {
      window.confirm(`Person with name "${newName}" is already in the list! Do you want to update his/her number?`)

      axios.put(`${baseUrl}/${presentPersons[0].id}`, newPerson)
            .then(
              response =>
              {
                const newPersons = persons.map(person => person.id === presentPersons[0].id ? {...person, number: newPhone} : person)
                setPersons(newPersons)
                setNewName('')
                setNewPhone('')

                const newMessage = {
                  message: `Person with name ${newName} successfully updated`,
                  type: 'notification'
                }
                console.log(response)

                setMessage(newMessage)
                console.log(message)
                setTimeout(() => setMessage({message:'',type:''}), 3000)

              }
            )


    }
    else if (newName !== '') {
      
      axios.post(baseUrl, newPerson)
            .then(
              response =>
              {
                const newPersons = persons.concat({
                  ...newPerson,
                  id: response.data.id
                })
                setPersons(newPersons)
                setNewName('')
                setNewPhone('')

                const newMessage = {
                  message: `Person with name ${newName} successfully added`,
                  type: 'notification'
                }

                setMessage(newMessage)
                console.log(message)
                setTimeout(() => setMessage({message:'',type:''}), 3000)
              }
            )

    }

  }

  const deletePerson = (person_to_delete) => {

    window.confirm(`Do you want to delete ${person_to_delete.name}`)

    axios.delete(`${baseUrl}/${person_to_delete.id}`)
          .then(
            response => {
              const newPersons = persons.filter(person => person.id !== person_to_delete.id)
              setPersons(newPersons)

              const newMessage = {
                message: `Person with name ${person_to_delete.name} successfully deleted`,
                type: 'notification'
              }

              setMessage(newMessage)
              console.log(message)
              setTimeout(() => setMessage({message:'',type:''}), 3000)
              
            }
          )
            .catch(
              error => {
                const newMessage = {
                  message: `Person with name ${person_to_delete.name} was already deleted`,
                  type: 'error'
                }

                setMessage(newMessage)
                console.log(message)
                setTimeout(() => setMessage({message:'',type:''}), 3000)
              }
            )

  }

  return (
    <div>
      <h1>Phonebook</h1>
        <Notification message={message.message} type={message.type} />
        search: <input value ={newSearch} onChange={handleSearchChange} />
      <h2>Add New</h2>
      <form onSubmit={handleSubmitPerson}>
        <div>
          name: <input value = {newName} onChange={handleNameChange}/> <br/>
          phone: <input value = {newPhone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {
          newSearch === '' ?
          <p>Please fill search field</p> : persons.filter(person => person.name.toUpperCase().includes(newSearch.toUpperCase()))
                                                    .map(
                                                      person => <Person key = {person.name}
                                                                          person = {person}
                                                                            onDelete={() => deletePerson(person)} />
                                                    )
        }
      </div>
    </div>
  )
}

export default App