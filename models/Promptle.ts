import mongoose from "mongoose";
import User from "./User";
import Game from "./Game";

const { ObjectId } = mongoose.Schema.Types;

export interface Promptle {
  game_id: object;
  prompt_id: string;
  images: string[];
  promptle_words: string[];
  solution: string;
  owner: object;
  featured: boolean;
  status: string;
}

const PromptleSchema = new mongoose.Schema<Promptle>(
  {
    game_id: {
      type: ObjectId,
      ref: Game,
    },
    prompt_id: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    promptle_words: {
      type: [String],
      default: [],
    },
    solution: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: User,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "queued",
    },
  },
  { timestamps: true }
);

const Promptle =
  mongoose.models.Promptle || mongoose.model("Promptle", PromptleSchema);
export default Promptle;
