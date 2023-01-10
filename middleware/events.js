const { format } = require( 'date-fns' );
const { v4: uuid } = require( 'uuid' )
const fs = require('fs')
const fsPromises = require( 'fs' ).promises
const path = require( 'path' )


const logEvents = async ( msg, fileName ) => {
    const dateTime = `${ format( new Date(), 'ddMMyyyy\tHH:mm:ss' ) }`
    const logItem = `${ dateTime }\t${ uuid() }\t${ msg }\n`;
    console.log( logItem )
    console.log(dateTime)
    
    try {

        if ( !fs.existsSync( path.join( __dirname, '..', 'logs' ) ) ) {
             //creating new directory
   await fsPromises.mkdir(path.join(__dirname, '..',  'logs'))
            
        }
        await fsPromises.appendFile(path.join(__dirname, '..',  'logs', fileName), logItem)
    } catch (error) {
        console.log(error)
    }
}

const logger =  ( req, res, next ) => {
    logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqlog.txt' )
    console.log( req.method + '' + req.url )
    next()
}

module.exports ={logger, logEvents}
// console.log( format( new Date(), 'ddMMyyyy\tHH:mm:ss' ) );

// console.log(uuid())