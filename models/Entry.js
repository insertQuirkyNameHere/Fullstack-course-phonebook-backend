const mongoose = require('mongoose');

const EntrySchema = mongoose.Schema({
    name: String,
    number: String,
});

EntrySchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    }
})

url = process.env.MONGO_DB_URI;
mongoose.connect(url)
    .then( result => console.log(`Database connected successfully`))
    .catch( error => console.log(`Error connecting to database: ${error}`));

module.exports =mongoose.model('Entry', EntrySchema);
