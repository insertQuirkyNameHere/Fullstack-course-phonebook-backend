const express = require('express');
const morgan = require('morgan');

const app = express();

app.use( express.json() );
app.use( express.static('build') );

morgan.token('body', (req, resp) => {
    console.log(req.body);
    return(JSON.stringify(req.body))
});

//Logging format for incoming requests
app.use(morgan( (tokens, request, response) => {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms', 
        tokens.body(request, response),
    ].join(' ');
}));

//Pre-mongo database
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


//generate Id for new persons
const generateId = () => Math.floor(Math.random()*1000+4);


//get list of all people in the phonebook
app.get('/api/persons', (request, response) => {
    response.json(persons);
});

//adding a person to the phonebook
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

    persons = persons.concat(newPerson);
    response.json(newPerson);
});


//get information regarding phonebook database
app.get('/info', (request, response) => {
    const sentPage = `
        <p>Phonebook has info of ${persons.length} people</p>
        <p>${new Date()}</p>
    `;
    response.send(sentPage);
});

//get information of a praticular person in the phonebook
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id-0;
    const personToDisplay = persons.find( person => person.id ===id);

    if(personToDisplay){
        response.json(personToDisplay);
    } else{
        response.status(404).end();
    }
});

//delete a person from the phonebook
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

const PORT = process.env.PORT||3001;
app.listen(PORT);
console.log(`App is listening for requests on port: ${PORT}`);