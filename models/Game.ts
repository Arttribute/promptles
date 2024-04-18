import mongoose from "mongoose";
import User from "./User";

const { ObjectId } = mongoose.Schema.Types;

export interface Game {
  game_title: string;
  description: string;
  images: string[];
  owner: object;
  featured: boolean;
  status: string;
}
const GameSchema = new mongoose.Schema<Game>(
  {
    game_title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
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

const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
export default Game;
