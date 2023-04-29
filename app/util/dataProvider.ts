// from https://github.com/marmelab/react-admin/blob/master/packages/ra-data-simple-rest/src/index.ts
import type { DataProvider, GetListParams } from "ra-core";
import { fetchUtils } from "ra-core";
import type { GetManyReferenceParams, GetOneParams, UpdateManyParams } from "react-admin";

function getPath(apiUrl: string, resource: string, params: GetOneParams<any> | UpdateManyParams<any>) {
  return `${apiUrl}/${resource}/${params.id}`;
}

function isGetManyReferenceParams(params: GetManyReferenceParams | GetListParams): params is GetManyReferenceParams {
  return (params as GetManyReferenceParams).target !== undefined;
}

function getList(apiUrl: string, httpClient = fetchUtils.fetchJson, resource: string, params: GetManyReferenceParams | GetListParams) {
  const { page, perPage } = params.pagination;
  const { field, order } = params.sort;

  const filter = {
    ...params.filter
  };

  if (isGetManyReferenceParams(params)) {
    if (params.target) {
      filter[params.target] = params.id;
    }
  }

  const urlSearchParams = new URLSearchParams({
    orderByDirection: order.toLowerCase(),
    orderBy: field,
    pageSize: `${perPage}`,
    page: `${page - 1}`, // index based 1 on react-admin, 0 on api
    ...filter
  });

  const url = `${apiUrl}/${resource}?${urlSearchParams}`;

  const options = {};

  return httpClient(url, options).then(({ headers, json }) => {
    if (!json.page) {
      throw new Error(
        `The page object is missing, it seem that the service did not respond with a paginated object.`
      );
    }
    return {
      data: json.data,
      total: json.page.totalElements
    };
  });
}

/**
 * Maps react-admin queries to a simple REST API
 *
 * This REST dialect is similar to the one of FakeRest
 *
 * @example
 *
 * getList     => GET http://my.api.url/posts?sort=['title','ASC']&range=[0, 24]
 * getOne      => GET http://my.api.url/posts/123
 * getMany     => GET http://my.api.url/posts?filter={id:[123,456,789]}
 * update      => PUT http://my.api.url/posts/123
 * create      => POST http://my.api.url/posts
 * delete      => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import simpleRestProvider from 'ra-data-simple-rest';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={simpleRestProvider("http://path.to.my.api/")}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (
  apiUrl: string,
  httpClient = fetchUtils.fetchJson
): DataProvider => ({
  getList: (resource, params) => getList(apiUrl, httpClient, resource, params),

  getOne: (resource, params) => {
    return httpClient(getPath(apiUrl, resource, params)).then(({ json }) => ({
      data: json
    }));
  },

  getMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "GET"
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json) }));
  },

  getManyReference: (resource, params) => getList(apiUrl, httpClient, resource, params),

  update: (resource, params) =>
    httpClient(getPath(apiUrl, resource, params), {
      method: "PUT",
      body: JSON.stringify(params.data)
    }).then(({ json }) => ({ data: json })),

  // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(getPath(apiUrl, resource, params), {
          method: "PUT",
          body: JSON.stringify(params.data)
        })
      )
    ).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data)
    })
      .then(response => {
        // handle redirection. We redirect from the proxy to our custom pages after creation
        // if (response.status === 302) {
        //   // window.location.href = response.headers.get('location') as string
        //   return { data: {} }
        // } else {
        return { data: response.json };
        // }
      }),

  delete: (resource, params) =>
    httpClient(getPath(apiUrl, resource, params), {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "text/plain"
      })
    }).then(({ json }) => ({ data: json })),

  // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "text/plain"
          })
        })
      )
    ).then((responses) => ({
      data: responses.map(({ json }) => json.id)
    }))
});

