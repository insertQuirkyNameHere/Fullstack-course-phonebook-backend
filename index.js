require('dotenv').config();
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const Entry = require('./models/Entry')

const app = express();

/*=======================   Express middleware   =======================*/
app.use( express.json() );
app.use( express.static('build') );

morgan.token('body', (req, resp) => {
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

/*================  Routes  ====================*/

//get all phonebook entries
app.get('/api/persons', (request, response, next) => {
    Entry.find({})
        .then(result => {
            return response.json(result);
        })
        .catch( error => next(error) );
});

//adding a person to the phonebook
app.post('/api/persons', (request, response, next) => {
    const body = request.body;
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Malformatted request. Please include name and number'
        })
    }
    
    Entry.findOneAndUpdate(
        {name: body.name},
        {$set: {number: body.number}},
        {upsert:true}
    )   .then( result => response.json(result))
        .catch( error => next(error));
});


//get information regarding phonebook database
app.get('/info', (request, response, next) => {
    const numberOfDocs = Entry.countDocuments({})
        .then(result => {
            const sentPage = `
                <p>Phonebook has info of ${result} people</p>
                <p>${new Date()}</p>
            `;
            response.send(sentPage);
        })
        .catch( error => next(error) );
});

//get information of a particular person in the phonebook
app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    const personToSend = Entry.findById(id)
        .then( result =>{
            response.json(result);
        })
        .catch( error => next(error));

});

//delete a person from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Entry.findByIdAndRemove(id)
        .then( result => {
            console.log('Deleted phonebook entry');
            response.status(204).end();
        })
        .catch( error => next(error))
})

const unknownEndpoint = (request, response, next) =>{
    response.status(404).json({
        'error':'Unkown endpoint'
    });

    next();
}

const errorHandler = (error, request, response, next) =>{
    if (error.name === 'CastError'){
        response.status(400).json({
            error: `Malformatted id`
        })
    }

    next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT||3001;
app.listen(PORT);
console.log(`App is listening for requests on port: ${PORT}`);