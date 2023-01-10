const userDB = {
    users: require( '../model/user.json' ),
    setUser: function( data ) {this.users = data}
};

const fsPromises = require( 'fs' ).promises;
const path = require( 'path' );

const bcrypt = require( 'bcrypt' );


const handleNewUser = async ( req, res ) => {
    //getting the username and pwd sent
    const { username, password } = req.body;
    
    //if username or password wasnt sent
    if(!username || !password ) {
        res.status( 400 );
        return res.status(400).json( {'message': 'Username or password not sent' } );
    }

    //checking if the user already exists
    const duplicate = userDB.users.find( person => person.username === username )
    if ( duplicate ) {
        return res.status(409).json( {'message': 'Username already exists' } ); //409 for conflict
    }

    //creating a new user
    try {
        //hashing the pwd with bcrypt
        const hashedPwd = await bcrypt.hash( password, 10 )
        const newUsers = { username: username, password: hashedPwd }
        
        //saving the new user
        userDB.setUser( [ ...userDB.users, newUsers ] )

        //writing the details to the file
        await fsPromises.writeFile( path.join( __dirname, '..', 'model', 'user.json' ), JSON.stringify( userDB.users) )
        
        console.log(userDB.users)
        //sending response
        res.status( 201 ).json( {'success': `New user ${newUsers.username} created successfully`} ); //200 for created


    } catch ( error ) {
        //sending err response
        res.status( 500 ).json( {
            message: error.message
        } ); //500 for server error
    }
}
 
module.exports = {handleNewUser};