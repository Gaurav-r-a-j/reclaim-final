import { InferSchemaType, model, Schema } from "mongoose";
import user from "./user";

const noteSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String },
    image: { type: String, required: true },
    campus: { type: String },
    place: { type: String },
    tag: { type: String, required: true },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);
