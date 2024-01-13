const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        //console.log(req.roles);
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        //console.log(rolesArray);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles