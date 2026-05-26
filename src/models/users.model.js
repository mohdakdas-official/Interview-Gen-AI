import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'Username already taken.'],
    },
    email: {
        type: String,
        unique: [true, 'Email already registered.'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

export const User = mongoose.model('User', userSchema);