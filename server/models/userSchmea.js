import mongosse from 'mongoose';

const userSchmea = mongosse.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: "https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png"
    },
},{timestamps: true})

const User = mongosse.model('User',userSchmea);
export default User;