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
        unique: true
    },
},{timestamps: true})

const User = mongosse.model('User',userSchmea);
export default User;