import http from "@/api/http.ts";


// 获取验证码
export const getEmailVerificationCode = (email: any) => {
    return http.get<boolean>(`/pub/email/verificationCode`, email);
};
