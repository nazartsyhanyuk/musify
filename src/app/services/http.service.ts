import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

import { environment } from '../../environments/environment';
import { createQueryString } from '../utils/utils';

const { BASE_URL } = environment;

export enum HttpMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE'
}

@Injectable()
export class HttpService {
  constructor(private $http: HttpClient) { }

  request({ httpMethod = HttpMethods.GET, endpoint, body = {},  queryParams = {}}): Observable<any> {
    const params = createQueryString(queryParams);

    switch (httpMethod) {
      case HttpMethods.GET:
        return this.$http.get(`${BASE_URL}/${endpoint}${params && `?${params}`}`);
      case HttpMethods.POST:
        return this.$http.post(`${BASE_URL}/${endpoint}`, body);
    }
  }
}
