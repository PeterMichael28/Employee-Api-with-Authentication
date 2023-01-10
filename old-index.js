const logEvents = require('./middleware/events')

const EventEmitter = require( 'events' );
const http = require( 'http' );
const path = require( 'path' )
const fs = require('fs')
const fsPromises = require('fs').promises

class Emitter extends EventEmitter { };
//initializer

const myEmitter = new Emitter()

//listening for  a log
myEmitter.on( 'log', ( msg, fileName ) => logEvents( msg, fileName ) );



//setting up a port
const PORT = process.env.PORT || 4500;

//serve file function
const serveFile = async ( filepath, contentType, response ) => {
    try {
        const rawData = await fsPromises.readFile(
            filepath,
            !contentType.includes('image')? 'utf8' :''
        );

        //checking if content-type is json
        const data = contentType === 'application/json' ? JSON.parse( rawData ) : rawData
        response.writeHead(
            filepath.includes('404.html') ? 404 : 200,
            { 'content-type': contentType }
        )
        response.end(
            contentType === 'application/json' ? JSON.stringify( data ) : data
        )
    } catch (error) {
        console.log( error )
        //emitter 
        myEmitter.emit( 'log', `${error.name}: ${error.message}`, 'errLog.txt' );
        response.statusCode = 500
        response.end()
    }
}

//setting up a server

const server = http.createServer( async ( request, response ) => {
    console.log(request.url)
    console.log(request.method)
    // console.log(response)
    myEmitter.emit( 'log', `${request.url}\t${request.method}`, 'reqLog.txt' );

    const extension = path.extname( request.url )
    let contentType;

    switch ( extension ) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html'
    }


    let filepath = contentType === 'text/html' && request.url === '/' ?
        path.join( __dirname, 'views', 'index.html' ) :
        contentType === 'text/html' && request.url.slice( -1 ) === '/' ?
        path.join( __dirname, 'views', request.url, 'index.html' ) :
            contentType === 'text/html' ? path.join( __dirname, 'views', request.url ) :
                path.join( __dirname, request.url )
    
    
    
    //makes .html extension not required in the browser
    if ( !extension && request.url.slice( -1 ) !== '/' ) filepath += '.html'
    


    const fileExists = fs.existsSync(filepath)

    if ( fileExists ) {
        //serve the file
        serveFile(filepath, contentType, response)

    } else {
        //404
        //301 redirect
        
        switch ( path.parse( filepath ).base ) {
            case 'old-page.html':
                response.writeHead( 301, { 'location': '/new-page.html' } );
                response.end();
                break;
             case 'new-page.html':
                response.writeHead( 301, { 'location': '/' } );
                response.end();
                break;
            default:
                //serve 404 page
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', response)
        }
    }
                
} )



//listening to the server
server.listen( PORT, () => console.log('server up and running on port ' + PORT))
    
    



//adding listener to events

// myEmitter.on( 'log', ( msg ) => logEvents( msg ) );


