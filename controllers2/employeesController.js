
const data = {
    employees: require( '../model/employees.json' ),
    setEmployees: function(data) {this.employees = data}
}

const fsPromises = require( 'fs' ).promises;
const path = require( 'path' );


const getAllEmployees = ( req, res ) => {
    res.json( data.employees );
};

const createNewEmployee = async ( req, res ) => {
    // res.json( {
    //     "firstName": req.body.firstName,
    //     "lastName": req.body.lastName
    // } );


    //new employees details sent
    const newEmployee = {
        id: data.employees[ data.employees.length - 1 ].id + 1 || 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }


    //checking for the first name and last name
    if ( !newEmployee.lastName || !newEmployee.firstName ) {
        return res.status(400).json({"message": "First and Last name are required."})
    }


    //adding the new employees to the data
    data.setEmployees( [ ...data.employees, newEmployee ] )

    //store the data back to the file
    await fsPromises.writeFile(
        path.join( __dirname, '..', 'model', 'employees.json' ),
        JSON.stringify(data.employees)
    )

    //sending back all the employees as a response
    res.status(201).json(data.employees)
};

const updateEmployee = async ( req, res ) => {
    // res.json( {
    //     "firstName": req.body.firstName
    // } );

    //finding the user profile with their id
    const employee = data.employees.find( emp => emp.id === parseInt( req.body.id ) )
    
    //checking if there is no employee
    if ( !employee ) {
        return res.status(400).json({"message": `Employee with the ID ${req.body.id} not found.`})
        
    }

    //updating the user firstName or lastName
    if ( req.body.firstName ) employee.firstName = req.body.firstName;
    if ( req.body.lastName ) employee.lastName = req.body.lastName;

    //filtering the old data employee to remove the old data
    const filteredEmployee = data.employees.filter( emp => emp.id !== parseInt( req.body.id ) )
    
    //adding the new employee data
    const unSortedEmployee = [ ...filteredEmployee, employee ]
    
    //sorting the data employee
    data.setEmployees( unSortedEmployee.sort( ( a, b ) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ) )

    //store the data back to the file
    await fsPromises.writeFile(
        path.join( __dirname, '..', 'model', 'employees.json' ),
        JSON.stringify(data.employees)
    )
    
    //send back all the data employee as a response
    res.json( data.employees )

};

const deleteEmployee = async ( req, res ) => {
    // res.json( {
    //     "id": req.body.id
    // } );

    //finding the user profile with their id
    const employee = data.employees.find( emp => emp.id === parseInt( req.body.id ) )
    
    //checking if there is no employee
    if ( !employee ) {
        return res.status(400).json({"message": `Employee with the ID ${req.body.id} not found.`})
    }

    //removing the employee
    filteredEmployees = data.employees.filter( emp => emp.id !== parseInt( req.body.id ) )
    
    data.setEmployees( [ ...filteredEmployees ] )

    // //sorting the data employee
    // data.setEmployees( filteredEmployees.sort( ( a, b ) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ) )
    
    //store the data back to the file
    await fsPromises.writeFile(
        path.join( __dirname, '..', 'model', 'employees.json' ),
        JSON.stringify(data.employees)
    )

    //sending back all the employees as a response
    res.json( data.employees )

};

const getEmployee =  ( req, res ) => {
    // res.json( {
    //     "id": req.params.id
    // } );

     //finding the user profile with their id
     const employee = data.employees.find( emp => emp.id === parseInt( req.body.id ) )
    
     //checking if there is no employee
     if ( !employee ) {
         return res.status(400).json({"message": `Employee with the ID ${req.body.id} not found.`})
         
    }
    
    //sending the employee data
    res.json( employee )

};


module.exports = {getAllEmployees, getEmployee, createNewEmployee, deleteEmployee, updateEmployee}