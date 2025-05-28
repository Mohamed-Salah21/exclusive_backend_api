import { Model, Document } from "mongoose";
import { findOptions } from "./factory.types";
import { NextFunction, Request, Response } from "express";
import ApiAggregationFeatures from "../../utils/ApiAggregationFeatures";
import ApiFeatures from "../../utils/ApiFeatures";
import ApiError from "../../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../../utils/ApiResponse";
import { Messages } from "../../common/responseMessages";

const getAll =
  <T extends Document>(
    model: Model<T>,
    modelName: string,
    findOptions?: findOptions
  ) =>
  async (request: Request, response: Response) => {
    if (findOptions?.aggregationPipelines) {
      const { mongoosePipeline } = new ApiAggregationFeatures(
        model,
        findOptions.aggregationPipelines,
        request.query
      )
        .filteration()
        .searching()
        .selecting()
        .sorting();
      // .pagination();
      const documents = await mongoosePipeline;
      ApiResponse(
        response,
        (Messages as Record<string, any>)[modelName].GET_ALL_SUCCESS,
        {
          results: documents.length,
          // metadata: paginationResult,
          data: documents,
        }
      );
      return;
    }
    const countDouments = await model.countDocuments();
    const { mongooseQuery, paginationResult } = new ApiFeatures(
      model,
      request.query
    )
      .filteration()
      .selection()
      .sorting()
      .population()
      .searching()
      .pagination(countDouments);
    if (findOptions?.selectedFields) {
      mongooseQuery.select(findOptions.selectedFields);
    }
    if (findOptions?.populatedFields) {
      mongooseQuery.populate(findOptions.populatedFields);
    }
    const documents: T[] = await mongooseQuery;
    ApiResponse(
      response,
      (Messages as Record<string, any>)[modelName].GET_ALL_SUCCESS,
      {
        results: documents.length,
        metadata: paginationResult,
        data: documents,
      }
    );
  };
const getById =
  <T extends Document>(model: Model<T>, modelName: string) =>
  async (request: Request, response: Response, next: NextFunction) => {
    const document = await model.findById(request.params.id);
    if (!document) {
      return next(
        new ApiError(
          (Messages as Record<string, any>)[modelName].GE_ONE_FAILED,
          StatusCodes.NOT_FOUND
        )
      );
    }
    ApiResponse(
      response,
      (Messages as Record<string, any>)[modelName].GE_ONE_SUCCESS,
      {
        data: document,
      }
    );
  };

const updateById =
  <T extends Document>(model: Model<T>, modelName: string) =>
  async (request: Request, response: Response, next: NextFunction) => {
    const document = await model.findByIdAndUpdate(
      request.params.id,
      {
        ...request.body,
      },
      { new: true }
    );
    if (!document) {
      return next(
        new ApiError(
          (Messages as Record<string, any>)[modelName].UPDATE_ONE_FAILED,
          StatusCodes.NOT_FOUND
        )
      );
    }
    document.save();
    ApiResponse(
      response,
      (Messages as Record<string, any>)[modelName].UPDATE_ONE_SUCCESS,
      {
        data: document,
      }
    );
  };

export { getAll, getById, updateById };
