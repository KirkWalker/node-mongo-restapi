const User = require('../model/User');

const handleLogout = async (req, res) => {
    //On client also delete the accesssToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;
    
    //Is refresh token in db
    const foundUser = await User.findOne({refreshToken}).exec();

    if (!foundUser) { 
        const prod = process.env.NODE_ENV === "production"
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: prod, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204); //Forbidden 
    }

    foundUser.refreshToken = '';
    const result = await foundUser.save();

    const prod = process.env.NODE_ENV === "production"
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: prod, maxAge: 24 * 60 * 60 * 1000 });
    res.sendStatus(204);

}

module.exports = { handleLogout }