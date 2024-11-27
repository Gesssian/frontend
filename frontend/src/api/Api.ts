/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Expedition {
  /** ID */
  id?: number;
  /** Owner */
  owner?: string;
  /** Moderator */
  moderator?: string;
  /** Climbers */
  climbers?: string;
  /** Статус */
  status?: 1 | 2 | 3 | 4 | 5;
  /**
   * Дата создания
   * @format date-time
   */
  date_created?: string | null;
  /**
   * Дата формирования
   * @format date-time
   */
  date_formation?: string | null;
  /**
   * Дата завершения
   * @format date-time
   */
  date_complete?: string | null;
  /**
   * Field
   * @min -2147483648
   * @max 2147483647
   */
  field?: number | null;
  /**
   * Date
   * @min -2147483648
   * @max 2147483647
   */
  date?: number | null;
}

export interface ClimberExpedition {
  /** ID */
  id?: number;
  /**
   * Поле м-м
   * @min -2147483648
   * @max 2147483647
   */
  count?: number;
  /** Climber */
  climber?: number | null;
  /** Expedition */
  expedition?: number | null;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

export interface UserRegister {
  /** ID */
  id?: number;
  /**
   * Адрес электронной почты
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Имя пользователя
   * Обязательное поле. Не более 150 символов. Только буквы, цифры и символы @/./+/-/_.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
}

export interface UserProfile {
  /**
   * Username
   * @minLength 1
   */
  username?: string;
  /**
   * Email
   * @minLength 1
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  expeditions = {
    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsList
     * @request GET:/expeditions/
     * @secure
     */
    expeditionsList: (
      query?: {
        status?: string;
        date_formation_start?: string;
        date_formation_end?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/expeditions/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsRead
     * @request GET:/expeditions/{expedition_id}/
     * @secure
     */
    expeditionsRead: (expeditionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expeditions/${expeditionId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsDeleteDelete
     * @request DELETE:/expeditions/{expedition_id}/delete/
     * @secure
     */
    expeditionsDeleteDelete: (expeditionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expeditions/${expeditionId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsDeleteClimberDelete
     * @request DELETE:/expeditions/{expedition_id}/delete_climber/{climber_id}/
     * @secure
     */
    expeditionsDeleteClimberDelete: (expeditionId: string, climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expeditions/${expeditionId}/delete_climber/${climberId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsUpdateUpdate
     * @request PUT:/expeditions/{expedition_id}/update/
     * @secure
     */
    expeditionsUpdateUpdate: (expeditionId: string, data: Expedition, params: RequestParams = {}) =>
      this.request<Expedition, any>({
        path: `/expeditions/${expeditionId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsUpdateClimberUpdate
     * @request PUT:/expeditions/{expedition_id}/update_climber/{climber_id}/
     * @secure
     */
    expeditionsUpdateClimberUpdate: (
      expeditionId: string,
      climberId: string,
      data: ClimberExpedition,
      params: RequestParams = {},
    ) =>
      this.request<ClimberExpedition, any>({
        path: `/expeditions/${expeditionId}/update_climber/${climberId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsUpdateStatusAdminUpdate
     * @request PUT:/expeditions/{expedition_id}/update_status_admin/
     * @secure
     */
    expeditionsUpdateStatusAdminUpdate: (expeditionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expeditions/${expeditionId}/update_status_admin/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags expeditions
     * @name ExpeditionsUpdateStatusUserUpdate
     * @request PUT:/expeditions/{expedition_id}/update_status_user/
     * @secure
     */
    expeditionsUpdateStatusUserUpdate: (expeditionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/expeditions/${expeditionId}/update_status_user/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  climbers = {
    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersList
     * @request GET:/climbers/
     * @secure
     */
    climbersList: (
      query?: {
        climber_name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/climbers/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersCreateCreate
     * @request POST:/climbers/create/
     * @secure
     */
    climbersCreateCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/create/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersRead
     * @request GET:/climbers/{climber_id}/
     * @secure
     */
    climbersRead: (climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/${climberId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersAddToExpeditionCreate
     * @request POST:/climbers/{climber_id}/add_to_expedition/
     * @secure
     */
    climbersAddToExpeditionCreate: (climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/${climberId}/add_to_expedition/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersDeleteDelete
     * @request DELETE:/climbers/{climber_id}/delete/
     * @secure
     */
    climbersDeleteDelete: (climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/${climberId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersUpdateUpdate
     * @request PUT:/climbers/{climber_id}/update/
     * @secure
     */
    climbersUpdateUpdate: (climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/${climberId}/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags climbers
     * @name ClimbersUpdateImageCreate
     * @request POST:/climbers/{climber_id}/update_image/
     * @secure
     */
    climbersUpdateImageCreate: (climberId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/climbers/${climberId}/update_image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/users/register/
     * @secure
     */
    usersRegisterCreate: (data: UserRegister, params: RequestParams = {}) =>
      this.request<UserRegister, any>({
        path: `/users/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @request PUT:/users/{user_id}/update/
     * @secure
     */
    usersUpdateUpdate: (userId: string, data: UserProfile, params: RequestParams = {}) =>
      this.request<UserProfile, any>({
        path: `/users/${userId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
