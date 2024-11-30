import http from "@/api/http.ts";
import {College, Exam, Subject} from "@/models/exam.ts";
import {PageInfo} from "@/models/resultJson.ts";

//上传文件
export const uploadFile = (data: FormData) => http.post<string>('/api/v1/exam/pub/upload/file', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 删除文件
export const deleteFile = (fileUrl: string) => http.get<boolean>('/api/v1/exam/pri/delete/file', {fileUrl: fileUrl})

// 获取全部院校
export const getAllColleges = () => http.get<College[]>('/api/v1/exam/pub/college/all')

// 分页获取院校信息
export const getCollegesByPage = (college: string | null, pageNum: number = 1, pageSize: number = 10) => http.get<PageInfo<College>>('/api/v1/exam/pub/college/page', {
    college: college,
    pageNum: pageNum,
    pageSize: pageSize
})

// 根据院校获取科目
export const getSubjectByCollege = (collegeCode: string) => http.get<Subject[]>('/api/v1/exam/pub/subject/by/college', {collegeCode: collegeCode})

// 创建考试
export const createExam = (data: Exam) => http.post<boolean>('/api/v1/exam/pri/create/exam', data)

// 删除考试
export const deleteExam = (examId: number) => http.get<boolean>('/api/v1/exam/pri/delete/exam', {examId: examId})

// 向考试添加文件
export const appendFileToExam = (examId: number, fileUrl: string) => http.get<boolean>('/api/v1/exam/pri/append/file', {
    examId: examId,
    fileUrl: fileUrl
})

// 删除考试文件
export const removeFileFromExam = (examId: number, fileUrl: string) => http.get<boolean>('/api/v1/exam/pri/remove/file', {
    examId: examId,
    fileUrl: fileUrl
})

// 获取考试题目
export const getExamTitles = (title: string) => http.get<string[]>('/api/v1/exam/pub/get/exam/titles', {title: title})

// 获取考试列表
export const getExamList = (college: string | null, subject: string | null, formDate: Date | null, toDate: Date | null, pageNum: number = 1, pageSize: number = 10) => http.get<PageInfo<Exam>>('/api/v1/exam/pub/get/exam', {
    college: college,
    subject: subject,
    formDate: formDate?.toISOString(),
    toDate: toDate?.toISOString(),
    pageNum: pageNum,
    pageSize: pageSize
})