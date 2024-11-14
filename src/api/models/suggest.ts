import http from "@/api/http.ts";
import {Suggest} from "@/models/suggest.ts";

// 创建建议
export const createSuggest = (data: Suggest) => http.post<boolean>('/api/v1/suggest/pub/create/suggest', data)
