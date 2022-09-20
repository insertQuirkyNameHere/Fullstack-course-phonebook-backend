const { response } = require('express');
const express = require('express');

const app = express();

app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const generateId = () => Math.floor(Math.random()*1000+4);

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if(!body.name || !body.number){
        return response.status(400).json(
            {error: 'Missing number or name'}
        );
    }

    const foundPerson = persons.find( person => {
        return person.name.toLowerCase() === body.name.toLowerCase();
    });
    
    if(foundPerson){
        return response.status(400).json(
            {error: 'This person already exists'}
        );
    }

    const newPerson = {
        id:generateId(),
        name: body.name,
        number: body.number
    };

    //persons = persons.concat(newPerson);
    response.json(newPerson);
});

app.get('/info', (request, response) => {
    const sentPage = `
        <p>Phonebook has info of ${persons.length} people</p>
        <p>${new Date()}</p>
    `;
    response.send(sentPage);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id-0;
    const personToDisplay = persons.find( person => person.id ===id);

    if(personToDisplay){
        response.json(personToDisplay);
    } else{
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id-0;
    const personToDelete = persons.find( person => person.id ===id);

    if(personToDelete){
        persons = persons.filter( person => person.id !== id);
        response.status(204).end();
    }else{
        response.status(404).end();
    }
})

const PORT = 3001;
app.listen(PORT);
console.log(`App is listening for requests on port: ${PORT}`);