const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const userSchema = mongoose.Schema({
    email : {
        required : true,
        type : String,
        unique : true,
        lowercase : true
    },
    
    password :{
        type : String,
        required : true,
        minlength : 6
    },
    solvedSudoku: {
        type : Number,
        required : true,
    }

}, {timestamp : true});

userSchema.pre ('save',async function (next) {
    //this
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.statics.login_get = async function (email, password){
    const user = await this.findOne ({email});
    if (user) {
        const auth = await bcrypt.compare (password, user.password);
        // console.log (auth);
        if (auth){
            return user;
        }throw Error ('incorrect password');
    }
    throw Error ('incorrect email');
}


const User = mongoose.model ('user', userSchema);


module.exports = User;