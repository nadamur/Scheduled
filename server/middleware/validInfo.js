module.exports = function(req, res, next){
  //check validity of username input
    const { username, password} = req.body;
    function validUsername(user){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user);
    }
    if (req.path === "/register") {
        console.log(!username.length);
        if (![username, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validUsername(username)) {
          return res.json("Invalid Email");
        }
      } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validUsername(username)) {
          return res.json("Invalid Email");
        }
      }
      //move on if valid
      next();
}