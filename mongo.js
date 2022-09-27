const mongoose = require('mongoose');

/*=============     Parameters not provided   ==========================*/
if (process.argv.length < 3){
    console.log('Please run again providing the password (or pwd, name and number)');
    process.exit(1);
}

/*=============     Add new entry   ==========================*/
if (process.argv.length === 5){

    //collect inputs
    const password = encodeURIComponent(process.argv[2]);
    const name = process.argv[3];
    const number = process.argv[4];

    const EntrySchema = mongoose.Schema({
        name: String,
        number: String,
    });

    const Entry = mongoose.model('Entries', EntrySchema)
    const url = `mongodb+srv://admin:${password}@cluster0.d1otfiu.mongodb.net/phonebook?retryWrites=true&w=majority`
    
    //connect to database, create and save new entry, log results and handle exceptions
    mongoose
        .connect(url)
        .then(result => {

            let newEntry = new Entry({
                'name': name,
                'number': number
            });

            return newEntry.save()
        })
        .then( result => {
            console.log(`Saved new entry`);
            return mongoose.connection.close();
        })
        .catch( error => {
            console.log(`Error: ${error}`);
            return mongoose.connection.close();
        })
/*===================    Retrieve all entries   ==========================*/
} else if(process.argv.length === 3){
    
    //Receive inputs
    const password = encodeURIComponent(process.argv[2]);

    const url = `mongodb+srv://admin:${password}@cluster0.d1otfiu.mongodb.net/phonebook?retryWrites=true&w=majority`
    
    const EntrySchema = mongoose.Schema({
        name: String,
        number: String,
    });

    mongoose.connect(url);

    const Entries = mongoose.model('Entries', EntrySchema);

    Entries
        .find({})
        .then( persons => {
            console.log(`Phonebook: `);
            persons.forEach( personObj => {
                console.log(`${personObj.name} ${personObj.number}`);
            })
        })  
        .then( () => mongoose.connection.close())
        .catch( error =>{
            console.log(error);
            return mongoose.connection.close();
        });
}