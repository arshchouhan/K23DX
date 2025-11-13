import User from "../models/user.model.js";



export async function GetCurrentUser(req, res) {
  try {

    const user = await User.findById(req.user.id);
    if(!user){
        res.json({
            message:"user not found"
        })
    }
    res.json({
        message:"you are loggedIn",
        user,
        
    })
  } catch (error) {
    res.status(404).json({
        message:"Something went wrong",
        error: error.message
    })
  }
}

export function UpdateCurrentUser(req, res) {
  res.send("Update Current User");
}
