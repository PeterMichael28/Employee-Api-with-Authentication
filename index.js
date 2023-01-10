
//env
require( 'dotenv' ).config();
const { logger, logEvents } = require( './middleware/events' )

const express = require( 'express' )
const app = express()
const path = require( 'path' )
const cors = require('cors')
const error = require('./middleware/error');
const { createDecipheriv } = require( 'crypto' );
const corsOptions = require( './config/corsOption' )
//getting jwt verification
const verifyJWT = require( './middleware/verifyJWT' )
const credentials = require('./middleware/credentials')

//cookie parser

const cookieParser = require('cookie-parser')



//setting up a port
const PORT = process.env.PORT || 4500;





//custom middleware logger
app.use( logger )

//handling options credentials check before cors\
app.use( credentials );

//corss origin resource sharing
app.use( cors( corsOptions ) );



//built-in middleware to handle urlencoded data like form data
//'content-type: application/x-www-form-urlencoded


app.use( express.urlencoded( { extended: false } ) )

//built in middleware for json
app.use( express.json() );

//middleware for cookies
app.use( cookieParser() );

//serve static files
app.use( express.static( path.join( __dirname, 'public' ) ) )
//for the sub dir
app.use('/subdir', express.static(path.join(__dirname, 'public')))




// usibg the router we created
app.use('/', require('./routes/root')) //root route
app.use('/subdir', require('./routes/subdir'))  //subdir route
app.use('/register', require('./routes/api/register'))  //registration api route
app.use( '/login', require( './routes/api/login' ) );  //login api route
app.use( '/refresh', require( './routes/api/refresh' ) );  //refresh token api route
app.use( '/logout', require( './routes/api/logout' ) );  //logout api route



app.use( verifyJWT );
app.use('/employees', require('./routes/api/employees'))  //api route





//app.all
app.all( '*', ( req, res ) => {

    res.status( 404 )
    //checking for the error type
    if ( req.accepts( 'html' ) ) {
        res.sendFile( path.join( __dirname, 'views', '404.html' ) );
    } else if ( req.accepts( 'json' ) ) {
        res.json({error: "404 Not Found"})
    } else {
        res.type('txt').send("404 Not Found")
    }
         
} )



//setting error
app.use(error)


//listening to the server
app.listen( PORT, () => console.log('server up and running on port ' + PORT))
    
    



//adding listener to events

// myEmitter.on( 'log', ( msg ) => logEvents( msg ) );


