const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    //res.json(data.employees);
    const employees = await Employee.find();
    if(!employees) return res.status(204).json({'message': 'No employees found'});
    res.json(employees);
}

const createNewEmployee =  async (req, res) => {
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({'message': 'First and last name are rquired'});
    }

    try {
        const result = await Employee.create( {
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}
    

const updateEmployees = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message': 'ID param is required'});
    
    var ObjectId = require('mongoose').Types.ObjectId;
    let isValid = ObjectId.isValid(req.body.id);
    if (!isValid) return res.status(400).json({'message': 'ID param is invalid'});

    const employee = await Employee.findOne({_id:req.body.id}).exec();
    if(!employee){
        return res.status(204).json({"message": `Employee ID ${req.body.id} not found`});
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployees = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({'message': 'ID param is required rquired'});

    const employee = await Employee.findOne({_id:req.body.id}).exec();
    if(!employee){
        return res.status(204).json({"message": `Employee ID ${req.body.id} not found`});
    }

    const result = await employee.deleteOne({_id:req.body.id});
    
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'ID param is required rquired'});

    const employee = await Employee.findOne({_id: req.params.id}).exec();
    if(!employee){
        return res.status(204).json({"message": `Employee ID ${req.body.id} not found`});
    }
    res.json(employee);
}


module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployees,
    deleteEmployees,
    getEmployee
}