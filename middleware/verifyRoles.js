const verifyRoles = ( ...allowedroles ) => {
    return ( req, res, next ) => {
        if ( !req.roles ) return res.sendStatus( 401 )
        const rolesArray = [ ...allowedroles ]
        const result = req.roles.map( role => rolesArray.includes( role ) ).find( val => val === true );
        if ( result ) return next()
        else return res.sendStatus( 401 )
        

    }
};

module.exports = verifyRoles
