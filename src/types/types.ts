import type { Request } from 'express';

export type TRequestWithBody<T> = Request<{}, {}, T>;
export type TRequestWithQuery<T> = Request<{}, {}, {}, T>;
export type TRequestWithParams<T> = Request<T>;
export type TRequestWithParamsAndBody<T, B> = Request<T, {}, B>;
