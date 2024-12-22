import http from "@/api/http.ts";
import {PageInfo} from "@/models/resultJson.ts";
import {Journal} from "@/models/journal.ts";

// 获取杂志标题
export const getJournalTitles = () => http.get<string[]>('/api/v1/journal/pub/get/titles')

// 创建杂志
export const createJournal = (data: Journal) => http.post<boolean>('/api/v1/journal/pub/create', data)

// 获取年份列表
export const getJournalYears = (title: string) => http.get<number[]>('/api/v1/journal/pub/get/years', {
    title: title
})

// 获取月份列表
export const getJournalMonths = (title: string, year: number) => http.get<number[]>('/api/v1/journal/pub/get/months', {
    title: title,
    year: year
})

// 获取杂志日期
export const getJournalDates = (title: string) => http.get<string[]>('/api/v1/journal/pub/get/dates', {title: title})

// 获取杂志
export const getJournals = (title: string, fromDate: Date, toDate: Date, pageNum: number = 1, pageSize: number = 31) => http.get<PageInfo<Journal>>('/api/v1/journal/pub/get/journals', {
    title: title,
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    pageNum: pageNum,
    pageSize: pageSize
})

//上传文件
export const uploadFile = (data: FormData) => http.post<string>('/api/v1/journal/pub/update/file', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})