import mongoose from "mongoose";
import User from "./User";
import Game from "./Game";

const { ObjectId } = mongoose.Schema.Types;

export interface Promptle {
  game_id: object;
  images: string[];
  promptle_words: string;
  solution: string;
  owner: object;
  featured: boolean;
}

const PromptleSchema = new mongoose.Schema<Promptle>(
  {
    game_id: {
      type: ObjectId,
      ref: Game,
    },
    images: {
      type: [String],
      default: [],
    },
    promptle_words: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Promptle =
  mongoose.models.Promptle || mongoose.model("Promptle", PromptleSchema);
export default Promptle;
