const User = require('../model/User')


const bcrypt = require( 'bcrypt' );


const handleNewUser = async ( req, res ) => {
    //getting the username and pwd sent
    const { username, password } = req.body;
    
    //if username or password wasnt sent
    if(!username || !password ) {
        return res.status(400).json( {'message': 'Username or password not sent' } );
    }

    //checking if the user already exists
    const duplicate = await User.findOne({username}).exec();
    if ( duplicate ) {
        return res.status(409).json( {'message': 'Username already exists' } ); //409 for conflict
    }

    //creating a new user
    try {
        //hashing the pwd with bcrypt
        const hashedPwd = await bcrypt.hash( password, 10 )
        //saving the new user
        const result = await User.create( { "username": username, "password": hashedPwd } );
        console.log(result)
        //sending response
        res.status( 201 ).json( {'success': `New user ${username} created successfully`} ); //200 for created


    } catch ( error ) {
        //sending err response
        res.status( 500 ).json( {
            message: error.message
        } ); //500 for server error
    }
}
 
module.exports = {handleNewUser};