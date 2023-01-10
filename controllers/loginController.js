const userDB = {
    users: require( '../model/user.json' ),
    setUser: function( data ) {this.users = data}
};

const fsPromises = require('fs').promises;
const path = require('path');

const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken' )




const userLogin = async ( req, res ) => {
    const { username, password } = req.body
    

        //checking if username and password was sent
    if ( !username || !password ) {
        return res.status( 400 ).json( { 'message': 'Username and password is required'} )
    }
    
    //checking if user exists
    const founduser = userDB.users.find(person => person.username === username)
            
    if ( !founduser ) {
        return res.status( 401 ).json( { 'message': 'Username is not recognized'} )
    }

    //checking the pwd
    const matchPwd = await bcrypt.compare( password, founduser.password )
    
    if ( matchPwd ) {
        const roles = Object.values( founduser.roles );
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": founduser.username,
                    "roles": roles
            }},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );
        const refreshToken = jwt.sign(
            { "username": founduser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );


        //saving the refresh token to the user data

        //creating an array of other users
        const otherUsers = userDB.users.filter( ( person ) => person.username !== founduser.username )
        
        //current users
        const currentUsers = { ...founduser, refreshToken }
        
        userDB.setUser([...otherUsers, currentUsers])

        await fsPromises.writeFile( path.join( __dirname, '..', 'model', 'user.json' ), JSON.stringify( userDB.users ) );
            
        res.cookie( 'jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true,  maxAge: 24 * 60 * 60 ^ 1000 } );
        return res.json( { accessToken } );
    } else {
        return res.status( 401 ).json( { 'message': 'Incorrect Password'} )
    }


};
    
module.exports = {userLogin}
