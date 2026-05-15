function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Authentication is required' });
}

function hasRole(...roles){
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Authentication is required' });
        }
        if (roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).json({ error: 'You don\'t have permissions to perform this action' });
    };
}


module.exports = { isAuthenticated, hasRole };