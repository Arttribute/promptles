import mongoose from "mongoose";
import User from "./User";
const { ObjectId } = mongoose.Schema.Types;

export interface TunedModel {
  model_id: string;
  model_name: string;
  description: string;
  status: string;
  display_image: string;
  owner: object;
  collection_id: object;
  license: string;
  token: string;
  featured: boolean;
  model_strength: string;
  slug: string;
  model_uuid: string;
  example_prompt: string;
  prompt_count: number;
  expires_at: Date;
}

const TunedModelSchema = new mongoose.Schema<TunedModel>(
  {
    model_id: {
      type: String,
      required: true,
    },
    model_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "created-training",
    },
    display_image: {
      type: String,
      required: true,
    },
    owner: {
      type: ObjectId,
      ref: User,
    },
    collection_id: {
      type: ObjectId,
      ref: "Collection",
    },
    license: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
    },
    model_uuid: {
      type: String,
      required: true,
    },
    example_prompt: {
      type: String,
      default: "",
    },
    prompt_count: {
      type: Number,
      default: 0,
    },
    expires_at: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

const TunedModel =
  mongoose.models.TunedModel || mongoose.model("TunedModel", TunedModelSchema);

export default TunedModel;
