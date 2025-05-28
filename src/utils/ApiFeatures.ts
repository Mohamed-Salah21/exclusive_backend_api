import { Document, Model } from "mongoose";
import qs from "qs";
class ApiFeatures<T extends Document> {
  mongooseQuery: any = [];
  paginationResult: any = {};
  private clonedParsedQuery: Record<string, any> = {};
  constructor(private model: Model<T>, private query: qs.ParsedQs) {}
  filteration() {
    const parsedQuery = qs.parse({ ...this.query } as Record<string, any>);
    this.clonedParsedQuery = { ...parsedQuery };
    const removedKeys = [
      "limit",
      "page",
      "keyword",
      "select",
      "sort",
      "populate",
    ];
    removedKeys.forEach((rKey) => delete parsedQuery[rKey]);
    let stringParsedQuery = JSON.stringify(parsedQuery);
    stringParsedQuery = stringParsedQuery.replace(
      /\b(gt|gte|eq|ne|lt|lte)\b/g,
      (match) => `$${match}`
    );
    console.log("stringParsedQuery", JSON.parse(stringParsedQuery));
    this.mongooseQuery = this.model.find(JSON.parse(stringParsedQuery));
    return this;
  }
  selection() {
    if (this.clonedParsedQuery.select) {
      this.mongooseQuery = this.mongooseQuery.select(
        this.clonedParsedQuery.select
      );
    }
    return this;
  }
  sorting() {
    if (this.clonedParsedQuery.sort) {
      this.mongooseQuery = this.mongooseQuery.sort(this.clonedParsedQuery.sort);
    }
    return this;
  }
  population() {
    if (this.clonedParsedQuery.populate) {
      this.mongooseQuery = this.mongooseQuery.populate(
        this.clonedParsedQuery.populate
      );
    }
    return this;
  }
  searching() {
    if (this.clonedParsedQuery.keyword) {
      const { keyword: keywordObject } = this.clonedParsedQuery;
      const keys = Object.keys(keywordObject);
      const searchedKeysValues = keys.map((key) => ({
        [key]: { $regex: keywordObject[key], $options: "i" },
      }));
      this.mongooseQuery.find({ $or: searchedKeysValues });
    }
    return this;
  }
  pagination(countDouments: number) {
    const currentPage: number = Number(this.clonedParsedQuery.page) || 1;
    const limit: number = Number(this.clonedParsedQuery.limit) || countDouments;
    const skip: number = (currentPage - 1) * limit;
    const numberOfPages = Math.floor(countDouments / limit);
    this.paginationResult = {
      limit,
      currentPage,
      numberOfPages,
      nextPage: currentPage < numberOfPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      hasNext: currentPage < numberOfPages,
      hasPrev: currentPage > 1,
    };
    this.mongooseQuery.limit(limit).skip(skip);
    return this;
  }
}
export default ApiFeatures;
