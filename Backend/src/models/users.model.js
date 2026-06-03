import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'Username already taken.'],
        lowercase: true,
        trim: true,

    },
    email: {
        type: String,
        unique: [true, 'Email already registered.'],
        required: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema);