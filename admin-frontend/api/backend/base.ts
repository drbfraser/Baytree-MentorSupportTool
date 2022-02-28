/** The base module provides reusuable functions to quickly create endpoints
 *  for performing CRUD operations on Django Models while supporting
 *  capabilities for pagination and filtering/sorting (in the future).
 */

import { refreshAccessToken } from "../../actions/auth/actionCreators";

/** Make paginated get requests to the backend to obtain model objects
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. limit specifies how many objects to return, while offset specifies
 * how many objects to skip in the resulting response of objects from the specified
 * backendEndpoint.
 */
const backendGetFetch = async (
  backendEndpoint: string,
  limit: string,
  offset: string
) => {
  return await fetch(`${backendEndpoint}?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

/** Generates a strongly-typed function given a backendEndpoint that will allow
 * paginated get requests via backendGetFetch() above. Information for how to
 * use the generated function can be seen from the JSDoc for backendGetFetch() above.
 */
export const generateBackendGetFunc =
  <ResponseObject>(backendEndpoint: string) =>
  async (limit: number, offset: number) => {
    try {
      const limitStr = limit.toString();
      const offsetStr = offset.toString();

      let apiRes = await backendGetFetch(backendEndpoint, limitStr, offsetStr);

      if (apiRes.status === 401) {
        const refreshRes = await refreshAccessToken();
        if (refreshRes) {
          apiRes = await backendGetFetch(backendEndpoint, limitStr, offsetStr);
        } else {
          return { total: -1, status: apiRes.status, data: null };
        }
      }

      const res = (await apiRes.json()) as {
        total: number;
        data: ResponseObject[];
      };

      const resWithStatus = { ...res, status: apiRes.status };

      return resWithStatus;
    } catch {
      return null;
    }
  };

/** Make post requests to the backend to create model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. backendEndpoint specifies the endpoint of the model to create
 * objects for, while requestObject contains an array of objects to create for
 * that model (as used in generateBackendPostFunc()). When creating objects
 * that have foreign key fields, providing an array of foreign key ids will
 * automatically link those ids to objects in the database.
 */
const backendPostFetch = async (
  backendEndpoint: string,
  requestObject: any
) => {
  const apiRes = await fetch(`${backendEndpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestObject),
  });

  return apiRes;
};

/** Generates a function to make post requests to the backend to create model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class via backendPostFetch() above.Information for how to use the generated
 * function can be seen from the JSDoc for backendPostFetch() above.
 */
export const generateBackendPostFunc =
  <RequestObject>(backendEndpoint: string) =>
  async (requestObject: RequestObject[] | RequestObject) => {
    try {
      const postFetchObject = Array.isArray(requestObject)
        ? { array: requestObject }
        : requestObject;

      let apiRes = await backendPostFetch(backendEndpoint, postFetchObject);

      if (apiRes.status === 401) {
        const refreshResponse = await refreshAccessToken();
        if (refreshResponse) {
          apiRes = await backendPostFetch(backendEndpoint, postFetchObject);
        } else {
          return { ids: null, status: apiRes.status };
        }
      }

      const res = (await apiRes.json()) as {
        ids: number[];
      };

      const resWithStatus = { ...res, status: apiRes.status };

      return resWithStatus;
    } catch {
      return null;
    }
  };

/** Make put requests to the backend to update model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. backendEndpoint specifies the endpoint of the model to create
 * objects for, while body contains an array of objects to update for that model.
 * Note that each object must contain the id of the model object in the Django
 * database to. When updating objects that have foreign key fields,
 * providing an array of foreign key ids will automatically link those ids to
 * objects in the database.
 */
const backendPutFetch = async (
  backendEndpoint: string,
  body: any
) => {
  const apiRes = await fetch(`${backendEndpoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return apiRes;
};

/** Generates a function to make put requests to the backend to update model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. backendEndpoint specifies the endpoint of the model to create
 * objects for. Information for how to use the generated function can be seen
 * from the JSDoc for backendPutFetch() above.
 */
export const generateBackendPutFunc =
  <RequestObject>(backendEndpoint: string) =>
  async (requestObject: RequestObject[] | RequestObject) => {
    try {
      const putFetchObject = Array.isArray(requestObject)
        ? { array: requestObject }
        : requestObject;

      let apiRes = await backendPutFetch(backendEndpoint, putFetchObject);

      if (apiRes.status === 401) {
        const refreshResponse = await refreshAccessToken();
        if (refreshResponse) {
          apiRes = await backendPutFetch(backendEndpoint, putFetchObject);
        } else {
          return { status: apiRes.status };
        }
      }

      const resStatus = { status: apiRes.status };

      return resStatus;
    } catch {
      return null;
    }
  };

/** Make delete requests to the backend to delete model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. backendEndpoint specifies the endpoint of the model to delete
 * objects from, while objectIds contains an array of object ids to delete for that model.
 */
const backendDeleteFetch = async (
  backendEndpoint: string,
  objectIds: number[]
) => {
  const apiRes = await fetch(
    `${backendEndpoint}?${objectIds.map((id) => `id=${id}&`)}`.slice(0, -1),
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  return apiRes;
};


/** Generates a function to make delete requests to the backend to delete model object(s)
 * which are implemented in the backend using the GenerateCrudEndpointsForModel
 * Python class. backendEndpoint specifies the endpoint of the model to delete
 * objects from. Information for how to use the generated function can be seen
 * from the JSDoc for backendDeleteFetch() above.
 */
export const generateBackendDeleteFunc =
  (backendEndpoint: string) => async (objectIds: number | number[]) => {
    try {
      if (!Array.isArray(objectIds)) {
        objectIds = [objectIds];
      }

      let apiRes = await backendDeleteFetch(backendEndpoint, objectIds);

      if (apiRes.status === 401) {
        const refreshResponse = await refreshAccessToken();
        if (refreshResponse) {
          apiRes = await backendDeleteFetch(backendEndpoint, objectIds);
        } else {
          return { status: apiRes.status };
        }
      }

      const resStatus = { status: apiRes.status };

      return resStatus;
    } catch {
      return null;
    }
  };

/** Generates all strongly-typed functions necessary for CRUD operations on any Django
 * Model object implemented with GenerateCrudEndpointsForModel in the Python
 * backend. backendEndpoint specifies the model endpoint to use in the backend.
 * CreateObject is a type specifying the structure of each object  to create for a model.
 * ResponseObject is a type specifying the structure of a model object response
 * from the backend for a Read operation (GET request). UpdateObject is a type
 * specifying the structure of model objects to be updated when performing an
 * Update operation (PUT request).
 */
export const generateBackendCrudFuncs = <
  CreateObject,
  ResponseObject,
  UpdateObject
>(
  backendEndpoint: string
) => {
  return {
    create: generateBackendPostFunc<CreateObject>(backendEndpoint),
    read: generateBackendGetFunc<ResponseObject>(backendEndpoint),
    update: generateBackendPutFunc<UpdateObject>(backendEndpoint),
    delete: generateBackendDeleteFunc(backendEndpoint),
  };
};