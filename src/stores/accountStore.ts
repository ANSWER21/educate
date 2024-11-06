import {defineStore} from "pinia";
import {Account, AccountState} from "@/models/account.ts";

export const useAccountStore = defineStore('account', {
    state: ():AccountState => ({
        token: null,
        accountInfo:null
    }),
    getters: {

    },
    actions: {
       // 设置token
        setToken(token:string){
           this.token = token;
       },
        setAccountInfo(accountInfo:Account){
           this.accountInfo = accountInfo;
       }
    }
});