<%*
// 1. 调用 MathJax 核心 API 异步加载 physics 宏包
if (window.MathJax && window.MathJax.tex2chtmlPromise) {
    try {
        await window.MathJax.tex2chtmlPromise('\\require{physics}');
    } catch (e) {
        console.error("MathJax physics preload error:", e);
    }

    // 2. 延迟 300 毫秒等待宏包注册，强制重构当前所有已打开的视图缓存
    setTimeout(() => {
        app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view && leaf.view.getViewType() === 'markdown') {
                if (typeof leaf.rebuildView === 'function') {
                    leaf.rebuildView();
                }
            }
        });
    }, 300);
}
-%>
