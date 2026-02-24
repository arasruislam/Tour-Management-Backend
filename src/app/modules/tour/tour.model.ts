import { Schema } from "mongoose";

const tourSchema = new Schema<>({}, {timestamps: true, versionKey:false})

export const Tour = model<IUser>("Tour", tourSchema);
