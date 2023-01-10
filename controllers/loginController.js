const User = require('../model/User')

const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken' )




const userLogin = async ( req, res ) => {
    const { username, password } = req.body
    

        //checking if username and password was sent
    if ( !username || !password ) {
        return res.status( 400 ).json( { 'message': 'Username and password is required'} )
    }
    
    //checking if user exists
    const founduser = await User.findOne( { username}).exec()
            
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

        founduser.refreshToken = refreshToken

        const result = await founduser.save()

        console.log(result)
        res.cookie( 'jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 ^ 1000 } ); //secure: true, 
        return res.json( { accessToken } );
    } else {
        return res.status( 401 ).json( { 'message': 'Incorrect Password'} )
    }


};
    
module.exports = {userLogin}
