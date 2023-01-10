const userDB = {
    users: require( '../model/user.json' ),
    setUser: function( data ) {this.users = data}
};

const fsPromises = require('fs').promises;
const path = require('path');




const handleLogout = async ( req, res ) => {
    const cookies = req.cookies;

        //checking if we have cookies
    if ( !cookies?.jwt) {
        return res.sendStatus( 204 ) // no content
    }

    const refreshToken = cookies.jwt;
    
    //checking if refresh token is there
    const founduser = userDB.users.find(person => person.refreshToken === refreshToken)
            
    if ( !founduser ) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus( 204 ) // sucessful but no content
    }

 //delete the refresh token from the db
    const otherUsers = userDB.users.filter(person => person.refreshToken !== founduser.refreshToken)
    const currentUsers = { ...founduser, refreshToken: '' }
    userDB.setUser([...otherUsers, currentUsers])

    await fsPromises.writeFile(
        path.join( __dirname, '..', 'model', 'user.json' ),
        JSON.stringify( userDB.users )
    )

    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true} ) //secure - true - only serves on https
    res.sendStatus( 204 ) // ok but no content

};
    
module.exports = {handleLogout}
