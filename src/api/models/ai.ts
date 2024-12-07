// 创建科目
import http from "@/api/http.ts";
import {Essay} from "@/models/essay.ts";

// 文本作文批改
export const textCorrectWritingV3 = (text: string, grade: string) => http.get<Essay>('/api/v1/ai/textCorrectWritingV3', {
    text: text,
    grade: grade
})

// 图片作文批改
export const imageCorrectWritingV3 = (data: FormData) => http.post<Essay>('/api/v1/ai/imageCorrectWritingV3', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
