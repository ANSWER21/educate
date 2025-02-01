import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import NProgress from "nprogress";
import {
    ACCOUNT_URL,
    BLOG_EDIT_URL,
    COLLEGE_MANAGE_URL,
    CONSOLE_URL,
    CORRECT_URL,
    EXAM_MANAGE_URL,
    EXAM_UPLOAD_URL,
    EXAM_URL,
    HOME_URL,
    JOURNAL_UPLOAD_URL,
    JOURNAL_URL,
    LOGIN_URL,
    PDF_PREVIEW_URL,
    ROUTER_WHITE_LIST,
    SUGGEST_URL
} from "@/config";
import {useAccountStore} from "@/stores/accountStore.ts";


/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: HOME_URL
    },
    {
        path: HOME_URL,
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: {title: "首页"},
    },
    {
        path: LOGIN_URL,
        name: "login",
        component: () => import("@/views/login/index.vue"),
        meta: {title: "登录"},
    },
    {
        path:ACCOUNT_URL,
        name: "account",
        component: () => import("@/views/account/index.vue"),
        meta: {title: "个人中心"},
    },
    {
        path:SUGGEST_URL,
        name: "suggest",
        component: () => import("@/views/suggest/index.vue"),
        meta: {title: "建议反馈"},
    },
    {
        path: CORRECT_URL,
        name: "correct",
        component: () => import("@/views/correct/index.vue"),
        meta: {title: "英语作文批改"},
    },
    {
        path: PDF_PREVIEW_URL,
        name: "pdf_preview",
        component: () => import("@/views/pdf/index.vue"),
        meta: {title: "PDF预览"},
    },
    {
        path: JOURNAL_URL,
        name: "journal",
        component: () => import("@/views/journal/index.vue"),
        meta: {title: "外刊阅读"},
    },
    {
        path: EXAM_URL,
        name: "exam",
        component: () => import("@/views/exam/index.vue"),
        meta: {title: "考研真题"},
    },
    {
        path: CONSOLE_URL,
        name: "console",
        component: () => import("@/views/console/index.vue"),
        meta: {title: "管理后台"},
        children: [
            {
                path: EXAM_UPLOAD_URL,
                name: "exam_upload",
                component: () => import("@/views/console/pages/exam/upload.vue"),
                meta: {
                    title: "真题上传",
                    isKeepAlive: false
                }
            },
            {
                path: EXAM_MANAGE_URL,
                name: "exam_manage",
                component: () => import("@/views/console/pages/exam/manage.vue"),
                meta: {
                    title: "真题管理",
                    isKeepAlive: false
                }
            },
            {
                path: COLLEGE_MANAGE_URL,
                name: "college_manage",
                component: () => import("@/views/console/pages/college/manage.vue"),
                meta: {
                    title: "院校管理",
                    isKeepAlive: false
                }
            },
            {
                path: JOURNAL_UPLOAD_URL,
                name: "journal_upload",
                component: () => import("@/views/console/pages/journal/upload.vue"),
                meta: {
                    title: "外刊上传",
                    isKeepAlive: false
                }
            },
            {
                path: BLOG_EDIT_URL,
                name: "blog_edit",
                component: () => import("@/views/console/pages/blog/Edit.vue"),
                meta: {
                    title: "博客编辑",
                    isKeepAlive: false
                }
            }
        ]
    }
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
    {
        path: "/403",
        name: "403",
        component: () => import("@/components/ErrorMessage/403.vue"),
        meta: {
            title: "403页面"
        }
    },
    {
        path: "/404",
        name: "404",
        component: () => import("@/components/ErrorMessage/404.vue"),
        meta: {
            title: "404页面"
        }
    },
    {
        path: "/500",
        name: "500",
        component: () => import("@/components/ErrorMessage/500.vue"),
        meta: {
            title: "500页面"
        }
    },
    // Resolve refresh page, route warnings
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/components/ErrorMessage/404.vue")
    }
];


/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */
const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRouter, ...errorRouter],
    strict: false,
    scrollBehavior: () => ({left: 0, top: 0})
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
    const accountStore = useAccountStore();

    // 1.NProgress 开始
    NProgress.start();

    // 2.动态设置标题
    const title = import.meta.env.VITE_GLOB_APP_TITLE;
    document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

    // 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
    if (to.path.toLocaleLowerCase() === LOGIN_URL) {
        if (accountStore.token) return next(from.fullPath);
        resetRouter();
        return next();
    }

    // 4.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (ROUTER_WHITE_LIST.includes(to.path)) return next();

    // 5.判断是否有 Token，没有重定向到 login 页面
    if (!accountStore.token) return next({path: LOGIN_URL, replace: false});

    // 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
    // if (!authStore.authMenuListGet.length) {
    //     await initDynamicRouter();
    //     return next({ ...to, replace: true });
    // }

    // 7.存储 routerName 做按钮权限筛选
    // authStore.setRouteName(to.name as string);

    // 8.正常访问页面
    next();
});

/**
 * @description 重置路由
 * */
export const resetRouter = () => {

};

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
    NProgress.done();
    console.warn("路由错误", error.message);
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
    NProgress.done();
});

export default router;