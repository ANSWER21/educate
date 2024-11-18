import http from "@/api/http.ts";
import {Account} from "@/models/account.ts";


// 获取验证码
export const getEmailVerificationCode = (email: string) => {
    return http.get<boolean>(`/api/v1/account/pub/email/verificationCode`, {email: email});
};

// 邮箱注册
export const emailRegister = (email: string, password: any, verificationCode: any) => {
    return http.get<Account>(`/api/v1/account/pub/login/email`, {
        email: email,
        password: password,
        verificationCode: verificationCode
    });
};

// 邮箱登录
export const emailLogin = (email: string, password: any) => {
    return http.get<Account>(`/api/v1/account/pub/login/email`, {email: email, password: password});
};

// 上传头像
export const uploadAvatar = (data: FormData) => http.post<Account>('/api/v1/account/pub/update/avatar', data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 更新验证码
export const updateEmail = (id: number, email: string, verificationCode: string) => {
    return http.get<boolean>("/api/v1/account/pub/update/email", {
        id: id,
        email: email,
        verificationCode: verificationCode
    })
}


// 更新用户信息
export const updateAccount = (account: Account) => http.post<Account>("/api/v1/account/pub/update/account", account)