import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true,
    },
    email: {
         type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true});
// mongoose middlewalre that runs before the database is saved
// pre save hook using mongoose,will run before the user document is saved
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// enetred password during login to check in database
// methos is calles matchpasword in mongoose,eneetered password means plain text password
userSchema.methods.matchPassword = async function (enetredPassword) {
    return await bcrypt.compare(enetredPassword,this.password);
    
}

const User = mongoose.model("User",userSchema);

export default User;