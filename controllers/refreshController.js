const userDB = {
    users: require( '../model/user.json' ),
    setUser: function( data ) {this.users = data}
};

const jwt = require( 'jsonwebtoken' )



const handleRefreshToken = async ( req, res ) => {
    const cookies = req.cookies;
    

        //checking if we don't have cookies
    if ( !cookies?.jwt) {
        return res.sendStatus( 401 )
    }

    const refreshToken = cookies.jwt;
    
    //checking if user exists
    const founduser = userDB.users.find(person => person.refreshToken === refreshToken)
            
    if ( !founduser ) {
        return res.sendStatus( 403 ) // forbidden
    }

 
        //evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            ( err, decoded ) => {
                if ( err || founduser.username !== decoded.username ) return res.sendStatus( 403 ); //forbidden
                const roles = founduser.roles
                const accessToken = jwt.sign(
                    { "UserInfo": {
                        "username": founduser.username,
                        "roles": roles
                }},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }

                );
                res.json({accessToken})
            } )


       


};
    
module.exports = {handleRefreshToken}
