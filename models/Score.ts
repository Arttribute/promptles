import mongoose from "mongoose";
import User from "./User";
import Game from "./Game";

const { ObjectId } = mongoose.Schema.Types;

export interface Score {
  game_id: object;
  player: object;
  score_value: number;
}

const ScoreSchema = new mongoose.Schema<Score>(
  {
    game_id: {
      type: ObjectId,
      ref: Game,
    },
    player: {
      type: ObjectId,
      ref: User,
    },
    score_value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Score = mongoose.models.Score || mongoose.model("Score", ScoreSchema);

export default Score;
