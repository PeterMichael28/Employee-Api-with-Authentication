
const express = require( 'express' );
const router = express.Router();


const path = require( 'path' );


//setting our first route
router.get( '^/$|/index(.html)?', ( req, res ) => {

    res.sendFile( path.join ( __dirname, '..', 'views', 'index.html' ) )
  
} )

router.get( '/new-page(.html)?', ( req, res ) => {
    //send a file
    res.sendFile( path.join( __dirname, '..', 'views', 'new-page.html' ) )

} )

router.get( '/old-page(.html)?', ( req, res ) => {
    //send a file
    res.redirect( 301, '/new-page.html')

} );

module.exports = router;