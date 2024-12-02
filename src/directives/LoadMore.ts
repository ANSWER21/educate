import type {Directive, DirectiveBinding} from "vue";

export const loadMore: Directive<HTMLElement> = {
    mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
        // 获取对应的下拉框 DOM 元素
        const selectDropdownWrap = document.querySelector(`.el-select-dropdown .el-select-dropdown__wrap`);
        if (!selectDropdownWrap) {
            console.log(`Element with  '.el-select-dropdown .el-select-dropdown__wrap' not found.`);
            return;
        }

        // 定义滚动事件处理函数
        const onScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = selectDropdownWrap;
            const scrollDistance = scrollHeight - scrollTop - clientHeight;
            if (scrollDistance <= 0) {
                binding.value();  // 调用绑定的函数
            }
        };

        // 添加滚动事件监听器
        selectDropdownWrap.addEventListener("scroll", onScroll);

        // 在元素上存储 onScroll 函数以便后续移除
        (el as any).__vueLoadMoreOnScroll__ = onScroll;
    },
    unmounted(el: HTMLElement) {
        // 获取对应的下拉框 DOM 元素
        const selectDropdownWrap = document.querySelector(`.el-select-dropdown .el-select-dropdown__wrap`);
        if (!selectDropdownWrap) return;

        // 移除滚动事件监听器
        const onScroll = (el as any).__vueLoadMoreOnScroll__;
        if (onScroll) {
            selectDropdownWrap.removeEventListener("scroll", onScroll);
        }
    }
};

export default loadMore;
