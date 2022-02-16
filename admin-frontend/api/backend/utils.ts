import { refreshAccessToken } from "../../actions/auth/actionCreators";

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

export const generateBackendGetFunc =
  <ResponseObject>(backendEndpoint: string) =>
  async (limit: number, offset: number) => {
    try {
      const limitStr = limit.toString();
      const offsetStr = offset.toString();

      let apiRes = await backendGetFetch(backendEndpoint, limitStr, offsetStr);

      if (apiRes.status === 401) {
        const refreshRes = await refreshAccessToken();
        if (refreshRes && refreshRes.status === 200) {
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
        if (refreshResponse && refreshResponse.status === 200) {
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
        if (refreshResponse && refreshResponse.status === 200) {
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

export const generateBackendDeleteFunc =
  (backendEndpoint: string) => async (objectIds: number | number[]) => {
    try {
      if (!Array.isArray(objectIds)) {
        objectIds = [objectIds];
      }

      let apiRes = await backendDeleteFetch(backendEndpoint, objectIds);

      if (apiRes.status === 401) {
        const refreshResponse = await refreshAccessToken();
        if (refreshResponse && refreshResponse.status === 200) {
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
