import mongoose, {Schema, Document, Types} from 'mongoose'

export interface IRSVP extends Document {
    guest: Types.ObjectId;
    status: 'accepted' | 'declined' | 'pending';
    attendingCount: number;
    message?: string;
    respondedAt?: Date;
}

const rsvpSchema = new Schema<IRSVP> (
    {
        guest: {types: Schema.Types.ObjectId, ref: 'Guest', required: true, unique: true},
        status: {type: String, enum: ['accepted', 'declined', 'pending'], default: 'pending'},
        attendingCount: {type: Number, default: 1},
        message: {type: String },
        respondedAt: {type: Date},
    },
    {timestamps: true}
);

export default mongoose.model<IRSVP>('IRSVP', rsvpSchema);