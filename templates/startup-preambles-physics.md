<%*
// 轮询等待 MathJax 全局对象和 startup 模块出现
async function waitForMathJax(maxTries = 50, interval = 100) {
    for (let i = 0; i < maxTries; i++) {
        if (window.MathJax?.startup?.promise) return true;
        await new Promise(r => setTimeout(r, interval));
    }
    return false;
}

if (await waitForMathJax()) {
    // 等 MathJax 核心真正初始化完成
    await window.MathJax.startup.promise;
    try {
        // 真正触发 physics 扩展加载，并等待其加载完成
        // （这一步耗时不确定，所以必须 await，而不是猜一个延迟）
        await window.MathJax.tex2chtmlPromise('\\require{physics}');
    } catch (e) {
        console.error("physics 包加载失败：", e);
    }

    // 此时扩展保证已加载完毕，才去强制重排已打开的笔记
    app.workspace.iterateAllLeaves(leaf => {
        if (leaf.view?.getViewType() === 'markdown') {
            if (typeof leaf.rebuildView === 'function') {
                leaf.rebuildView();
            } else if (leaf.view.previewMode?.rerender) {
                // 备用方案：不同 Obsidian 版本内部 API 可能不同
                leaf.view.previewMode.rerender(true);
            }
        }
    });
}
-%>