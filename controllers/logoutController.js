const User = require('../model/User')




const handleLogout = async ( req, res ) => {
    const cookies = req.cookies;

        //checking if we have cookies
    if ( !cookies?.jwt) {
        return res.sendStatus( 204 ) // no content
    }

    const refreshToken = cookies.jwt;
    
    //checking if refresh token is there
    const founduser = await User.findOne( { refreshToken}).exec()
            
    if ( !founduser ) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus( 204 ) // successfull but no content
    }

    //delete the refreshToken
    founduser.refreshToken = ''

    const result = await founduser.save()

    console.log(result)

    res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true} ) //secure - true - only serves on https
    res.sendStatus( 204 ) // ok but no content

};
    
module.exports = {handleLogout}
