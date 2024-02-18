module.exports = function(req, res, next){
    const { username, password} = req.body;
    function validUsername(user){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user);
    }
    if (req.path === "/register") {
        console.log(!username.length);
        if (![username, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        }
      } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        }
      }
    
      next();
}