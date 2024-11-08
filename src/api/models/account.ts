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