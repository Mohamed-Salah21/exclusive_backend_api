import { PipelineStage } from "mongoose";

export type findOptions = {
  selectedFields?: string;
  populatedFields?: string;
  aggregationPipelines?: PipelineStage[];
};