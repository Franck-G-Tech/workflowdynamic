/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as Users from "../Users.js";
import type * as breakcalculation from "../breakcalculation.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as inngest from "../inngest.js";
import type * as requests from "../requests.js";
import type * as sanityIntegration from "../sanityIntegration.js";
import type * as vacation_request from "../vacation_request.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  Users: typeof Users;
  breakcalculation: typeof breakcalculation;
  crons: typeof crons;
  http: typeof http;
  inngest: typeof inngest;
  requests: typeof requests;
  sanityIntegration: typeof sanityIntegration;
  vacation_request: typeof vacation_request;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
