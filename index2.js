const { logger, logEvents} = require('./middleware/events')

const express = require( 'express' )
const app = express()
const path = require( 'path' )
const cors = require('cors')
const error = require('./middleware/error');
const { createDecipheriv } = require( 'crypto' );
const corsOptions = require( './config/corsOption' )
//getting jwt verification
const verifyJWT = require( './middleware/verifyJWT' )

//cookie parser

const cookieParser = require('cookie-parser')



//setting up a port
const PORT = process.env.PORT || 4500;





//custom middleware logger
app.use( logger )


app.use(cors(corsOptions))

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



app.use( verifyJWT );
app.use('/employees', require('./routes/api/employees'))  //api route



// //setting our first route
// app.get( '^/$|/index(.html)?', ( req, res ) => {

//     //sending a text
//     // res.send( 'hello world who dey' )

//     //send a file
//     res.sendFile( path.join ( __dirname, 'views', 'index.html' ) )
//     //OR
//     // res.sendFile('./views/index.html', {root: __dirname} )

// } )

// app.get( '/new-page(.html)?', ( req, res ) => {
//     //send a file
//     res.sendFile( path.join( __dirname, 'views', 'new-page.html' ) )

// } )

// app.get( '/old-page(.html)?', ( req, res ) => {
//     //send a file
//     res.redirect( 301, '/new-page.html')

// } )

// //Routes Handlers
// app.get( '/hello(.html)?', ( req, res, next ) => {
//     console.log( 'an attempt' );
//     next();
// }, ( req, res ) => {
//     // res.send( 'hello world' )
//     // res.sendFile( path.join( __dirname, 'views', 'new-page.html' ) )
// } );

//chaining route handlers

// const one = ( req, res, next ) => {
//     console.log( 'one' )
//     next()
// }
// const two = ( req, res, next ) => {
//     console.log( 'two' )
//     next()
// }
// const three = ( req, res, next ) => {
//     console.log( 'three' )
//     next()
//     res.send( 'hello world' )
// }

// app.get( '/chain(.html)?', [ one, two, three ] )






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


