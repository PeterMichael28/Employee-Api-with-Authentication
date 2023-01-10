const userDB = {
    users: require( '../model/user.json' ),
    setUser: function( data ) {this.users = data}
};

const jwt = require( 'jsonwebtoken' )

//env
require( 'dotenv' ).config();


const handleRefreshToken = async ( req, res ) => {
    const cookies = req.cookies;
    

        //checking if we have cookies
    if ( !cookies?.jwt) {
        return res.sendStatus( 401 )
    }

    const refreshToken = cookies.jwt;
    
    //checking if user exists
    const founduser = userDB.users.find(person => person.refreshToken === refreshToken)
            
    if ( !founduser ) {
        return res.sendStatus( 401 )
    }

 

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            ( err, decoded ) => {
                if ( err || founduser !== decoded.username ) return res.sendStatus( 403 )
                const accessToken = jwt.sign(
                    { "username": decoded.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1m' }

                );
                res.json({accessToken})
            } )


       


};
    
module.exports = {handleRefreshToken}
