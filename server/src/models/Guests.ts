import mongoose, { Schema, Document} from 'mongoose';

export interface IGuest extends Document {
    name: string;
    email: string;
    phone?: string;
    numberOfSeats: number;
    inviteToken: string;
    createdAt: Date;
}

const guestSchema = new Schema<IGuest> (
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phone: {type: String},
        numberOfSeats: {type: Number, default: 1},
        inviteToken: {type: String, required: true, unique: true},  
    },
    {timestamps: true}

);

export default mongoose.model<IGuest>('Guest', guestSchema);
