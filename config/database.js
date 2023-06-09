const mongoose = require('mongoose')

require('dotenv').config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
        .then( () => {
            console.log("Database connection established")
        })
        .catch( (err) => {
            console.log('Error while connecting to database')
            console.error(err)
            process.exit(1)
        })
}