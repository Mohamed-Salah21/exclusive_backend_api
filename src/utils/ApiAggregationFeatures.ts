import { Document, Model, PipelineStage } from "mongoose";
import { parse, ParsedQs } from "qs";
class ApiAggregationFeatures<T extends Document> {
  public mongoosePipeline: any = [];
  private pipelines: PipelineStage[] = [];
  private parsedQueries: Record<string, any> | ParsedQs = {};
  constructor(
    private model: Model<T>,
    private initialPipelines: PipelineStage[],
    private queries: ParsedQs
  ) {
    this.pipelines = this.initialPipelines;
    this.mongoosePipeline = this.model.aggregate(this.pipelines);
    this.parsedQueries = parse({ ...this.queries } as Record<string, any>);
  }
  filteration() {
    const filterQueries = { ...this.parsedQueries };
    const excludedFields = [
      "limit",
      "page",
      "keyword",
      "select",
      "sort",
      "populate",
    ];
    excludedFields.forEach((key) => delete filterQueries[key]);
    if (Object.keys(filterQueries).length) {
      let stringFilterQs = JSON.stringify(filterQueries);
      stringFilterQs = stringFilterQs.replace(
        /\b(gt|gte|eq|ne|lt|lte)\b/g,
        (match) => `$${match}`
      );
      const matchIndex = this.pipelines.findIndex(
        (stage: PipelineStage) => "$match" in stage
      );
      const parsedFilterQS = JSON.parse(stringFilterQs as string);

      if (matchIndex === -1) {
        this.pipelines.push({ $match: convertTypes(parsedFilterQS) });
      } else {
        const matchStage = this.pipelines[matchIndex] as PipelineStage.Match;
        matchStage.$match = convertTypes(parsedFilterQS);
      }
    }
    this.mongoosePipeline = this.model.aggregate(this.pipelines);
    return this;
  }
  searching() {
    if (this.parsedQueries.keyword) {
      const keywordObj = this.parsedQueries.keyword;
      const keys = Object.keys(this.parsedQueries.keyword);
      const serachValues = keys.map((key: string) => ({
        [key]: { $regex: keywordObj[key], $options: "i" },
      }));
      const matchIndex = this.pipelines.findIndex(
        (pipeline) => `$match` in pipeline
      );
      if (matchIndex === -1) {
        this.pipelines.push({ $match: { $or: serachValues } });
      } else {
        const matchStage = this.pipelines[matchIndex] as PipelineStage.Match;
        if (matchStage.$match.$or && Array.isArray(matchStage.$match.$or)) {
          matchStage.$match = {
            $or: matchStage.$match.$or.concat(serachValues),
          };
        } else {
          let orValues = [...serachValues];
          if (matchStage.$match) {
            orValues = [...orValues, matchStage.$match];
          }
          matchStage.$match = {
            $or: orValues,
          };
        }
      }
    }
    this.mongoosePipeline = this.model.aggregate(this.pipelines);
    return this;
  }
  selecting() {
    if (this.parsedQueries.select) {
      let selectFields: string[] = this.parsedQueries.select.split(" ");

      const pipelineProjects: any = this.initialPipelines.find(
        (pipeline) => "$project" in pipeline
      )?.$project;

      if (pipelineProjects && Object.keys(pipelineProjects).length) {
        Object.keys(pipelineProjects).forEach((proKey) => {
          if (pipelineProjects[proKey] === 1) {
            selectFields.push(proKey);
          }
        });
      }

      const projectValues: Record<string, number> = {};
      for (let i = 0; i < selectFields.length; i++) {
        const field = selectFields[i];
        projectValues[field] = 1;
      }
      let findProjectPipeline: PipelineStage.Project | undefined =
        this.pipelines.find((p) => `$project` in p);
      if (!findProjectPipeline) {
        this.pipelines[this.pipelines.length] = {
          $project: projectValues,
        };
      } else {
        findProjectPipeline.$project = projectValues;
      }
    }
    this.mongoosePipeline = this.model.aggregate(this.pipelines);
    return this;
  }
  sorting() {
    if (this.parsedQueries.sort) {
      const sortedFields: string[] = this.parsedQueries.sort.split(" ");
      const sortValues = sortedFields.reduce((acc, sField) => {
        const isDescending = sField.startsWith("-");
        const fieldName = isDescending ? sField.slice(1) : sField;
        return {
          ...acc,
          [fieldName]: !isDescending ? 1 : -1,
        };
      }, {});
      const sortIndex = this.pipelines.findIndex((stage) => `$sort` in stage);
      if (sortIndex < 0) {
        this.pipelines.push({ $sort: sortValues });
      } else {
        this.pipelines[sortIndex] = {
          $sort: sortValues,
        };
      }
      this.mongoosePipeline = this.model.aggregate(this.pipelines);
    }
    return this;
  }
  pagination() {
    const limit = Number(this.parsedQueries.limit);
    const page = Number(this.parsedQueries.page);
    const skip = (page + 1) * limit;
    if (limit && page) {
      const skipIndex = this.pipelines.findIndex((stage) => "$skip" in stage);
      const limitIndex = this.pipelines.findIndex((stage) => "$limit" in stage);
      if (limitIndex !== -1) {
        this.pipelines[limitIndex] = { $limit: limit };
      } else {
        this.pipelines.push({ $limit: limit });
      }
      if (skipIndex !== -1) {
        this.pipelines[skipIndex] = { $skip: skip };
      } else {
        this.pipelines.push({ $skip: skip });
      }
      console.log("final pipelines", this.pipelines);
    } else {
      this.pipelines = this.pipelines.filter(
        (pip) => "$skip" in pip || "$limit" in pip
      );
    }
    this.mongoosePipeline = this.model.aggregate(this.pipelines);
    return this;
  }
}
function convertTypes(obj: Record<string, any>): Record<string, any> {
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = convertTypes(obj[key]);
    } else if (!isNaN(obj[key])) {
      obj[key] = Number(obj[key]);
    }
  }
  return obj;
}
export default ApiAggregationFeatures;
