const Employee = require('../model/Employee')



const getAllEmployees = async ( req, res ) => {
    const employees = await Employee.find();
    if ( !employees ) return res.status( 204 ).json( { "message": "No employees found" } )
    res.json(employees)
};

const createNewEmployee = async ( req, res ) => {

    //checking for the first name and last name
    if ( !req?.body?.firstname || !req?.body?.lastname ) {
        return res.status(400).json({"message": "First and Last name are required."})
    }

    //create employee
    try {
        const result = await Employee.create( { firstname: req.body.firstname, lastname: req.body.lastname } )
        res.status(201).json(result)
    } catch (error) {
        console.log(error)
    }
};

const updateEmployee = async ( req, res ) => {

    if ( !req?.body?.id ) {
        res.status( 400 ).json( { "message": "Employee ID is required" })
    }

    //finding the user profile with their id
    const employee = await Employee.findOne({_id: req.body.id}).exec()
    
    //checking if there is no employee
    if ( !employee ) {
        return res.status(204).json({"message": `No employee with that ID found.`})
        
    }

    //updating the user firstName or lastName
    if ( req.body?.firstname ) employee.firstname = req.body.firstname;
    if ( req.body?.lastname ) employee.lastname = req.body.lastname;

   const result = await employee.save()
    //send back all the data employee as a response
    res.json( result )

};

const deleteEmployee = async ( req, res ) => {

    if ( !req?.body?.id ) {
        res.status( 400 ).json( { "message": "Employee ID is required" })
    }
 
    //finding the user profile with their id
    const employee = await Employee.findOne({_id: req.body.id}).exec()
    
    //checking if there is no employee
    if ( !employee ) {
        return res.status(204).json({"message": `No employee with that ID found.`})
        
    }

    const result = await employee.deleteOne({_id:req.body.id})

    //sending back all the employees as a response
    res.json( result )

};

const getEmployee = async ( req, res ) => {
    
    if ( !req?.params?.id ) {
        res.status( 400 ).json( { "message": "Employee ID is required" })
    }
 
    //finding the user profile with their id
    const employee = await Employee.findOne({_id: req.params.id}).exec()
    
     //checking if there is no employee
     if ( !employee ) {
         return res.status(400).json({"message": `Employee with the ID ${req.body.id} not found.`})
         
    }
    
    //sending the employee data
    res.json( employee )

};


module.exports = {getAllEmployees, getEmployee, createNewEmployee, deleteEmployee, updateEmployee}