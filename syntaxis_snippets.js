export default [
    
    // MathJax Block
    { trigger: "$",  replacement: "$$0$$1",       options: "t", priority: 1 },
    { trigger: "$$", replacement: "$$\n$0\n$$$1", options: "t", priority: 2 },

    // Greek letters
    { trigger: "@a",  replacement: "\\alpha",      options: "mA" },
    { trigger: "@b",  replacement: "\\beta",       options: "mA" },
    { trigger: "@g",  replacement: "\\gamma",      options: "mA" },
    { trigger: "@G",  replacement: "\\Gamma",      options: "mA" },
    { trigger: ":G",  replacement: "\\varGamma",   options: "mA" },
    { trigger: "@d",  replacement: "\\delta",      options: "mA" },
    { trigger: "@D",  replacement: "\\Delta",      options: "mA" },
    { trigger: ":D",  replacement: "\\varDelta",   options: "mA" },
    { trigger: "@e",  replacement: "\\epsilon",    options: "mA" },
    { trigger: ":e",  replacement: "\\varepsilon", options: "mA" },
    { trigger: "@z",  replacement: "\\zeta",       options: "mA" },
    { trigger: "@h",  replacement: "\\eta",        options: "mA" },
    { trigger: "@th", replacement: "\\theta",      options: "mA" },
    { trigger: "@Th", replacement: "\\Theta",      options: "mA" },
    { trigger: ":th", replacement: "\\vartheta",   options: "mA" },
    { trigger: ":Th", replacement: "\\varTheta",   options: "mA" },
    { trigger: "@i",  replacement: "\\iota",       options: "mA" },
    { trigger: "@k",  replacement: "\\kappa",      options: "mA" },
    { trigger: "@l",  replacement: "\\lambda",     options: "mA" },
    { trigger: "@L",  replacement: "\\Lambda",     options: "mA" },
    { trigger: ":L",  replacement: "\\varLambda",  options: "mA" },
    { trigger: "@m",  replacement: "\\mu",         options: "mA" },
    { trigger: "@n",  replacement: "\\nu",         options: "mA" },
    { trigger: "@x",  replacement: "\\xi",         options: "mA" },
    { trigger: "@X",  replacement: "\\Xi",         options: "mA" },
    { trigger: ":X",  replacement: "\\varXi",      options: "mA" },
    { trigger: "@o",  replacement: "\\omicron",    options: "mA" },
    { trigger: "@O",  replacement: "\\mathrm{O}",  options: "mA" },
    { trigger: "@pi", replacement: "\\pi",         options: "mA" },
    { trigger: "@Pi", replacement: "\\Pi",         options: "mA" },
    { trigger: ":pi", replacement: "\\varpi",      options: "mA" },
    { trigger: ":Pi", replacement: "\\varPi",      options: "mA" },
    { trigger: "@r",  replacement: "\\rho",        options: "mA" },
    { trigger: ":r",  replacement: "\\varrho",     options: "mA" },
    { trigger: "@s",  replacement: "\\sigma",      options: "mA" },
    { trigger: "@S",  replacement: "\\Sigma",      options: "mA" },
    { trigger: ":s",  replacement: "\\varsigma",   options: "mA" },
    { trigger: ":S",  replacement: "\\varSigma",   options: "mA" },
    { trigger: "@t",  replacement: "\\tau",        options: "mA" },
    { trigger: "@u",  replacement: "\\upsilon",    options: "mA" },
    { trigger: "@U",  replacement: "\\Upsilon",    options: "mA" },
    { trigger: ":U",  replacement: "\\varUpsilon", options: "mA" },
    { trigger: "@ph", replacement: "\\phi",        options: "mA" },
    { trigger: "@Ph", replacement: "\\Phi",        options: "mA" },
    { trigger: ":ph", replacement: "\\varphi",     options: "mA" },
    { trigger: ":Ph", replacement: "\\varPhi",     options: "mA" },
    { trigger: "@ch", replacement: "\\chi",        options: "mA" },
    { trigger: "@ps", replacement: "\\psi",        options: "mA" },
    { trigger: "@w",  replacement: "\\omega",      options: "mA" },
    { trigger: "@W",  replacement: "\\Omega",      options: "mA" },
    { trigger: ":W",  replacement: "\\varOmega",   options: "mA" },

    // ^{} _{}
    { trigger: "^^",  replacement: "^{$0}$1",     options: "mA", priority: 1 },
    { trigger: "^^^", replacement: "{$0}^{$1}$2", options: "m",  priority: 2 },
    { trigger: "__",  replacement: "_{$0}$1",     options: "mA", priority: 1 },
    { trigger: "___", replacement: "{$0}_{$1}$2", options: "m",  priority: 2 },

    // \begin{} \end{}
    { trigger: /\\?([a-zA-Z]+)beg/, replacement: "\\begin{[[0]]}\n$0\n\\end{[[0]]}", options: "MA" },
    { trigger: /\\?([a-zA-Z]+)beg/, replacement: "\\begin{[[0]]} $0 \\end{[[0]]}",   options: "nA" },
    // /left([{ /right)]}
    {
        trigger: /([\(\\[\\{\\<\\|]|lvert|lbrack)lr/,
        replacement: (match) => {
            const bracketConfig = {
                "(":      { close: ")", left: "(",        right: ")" },
                "[":      { close: "]", left: "[",        right: "]" },
                "{":      { close: "}", left: "\\{",      right: "\\}" },
                "<":      { close: ">", left: "\\langle", right: "\\rangle" },
                "|":      { close: "|", left: "|",        right: "|" },
                "lvert":  { close: "",  left: "\\lvert",  right: "\\rvert" },
                "lbrack": { close: "",  left: "\\lbrack", right: "\\rbrack" },
            };
            const open = match[1];
            const cfg = bracketConfig[open];
            if (!cfg) return match[0]; 

            const editor = app.workspace.activeEditor?.editor || app.workspace.getActiveViewOfType(Object)?.editor;
            if (editor) {
                const pos = editor.getCursor();
                const nextChar = editor.getRange(pos, { line: pos.line, ch: pos.ch + 1 });
                if (nextChar === cfg.close) {
                    editor.replaceRange("", pos, { line: pos.line, ch: pos.ch + 1 });
                }
            }

            return `\\left${cfg.left} $0 \\right${cfg.right}$1`;
        },
        options: "mA"
    },
    // Brackets
    { trigger: "avg",   replacement: "\\langle $0 \\rangle $1", options: "mA" },
    { trigger: "norm",  replacement: "\\lvert $0 \\rvert $1",   options: "mA", priority: 1 },
    { trigger: "Norm",  replacement: "\\lVert $0 \\rVert $1",   options: "mA", priority: 1 },
    { trigger: "ceil",  replacement: "\\lceil $0 \\rceil $1",   options: "mA" },
    { trigger: "floor", replacement: "\\lfloor $0 \\rfloor $1", options: "mA" },
    
    // { trigger: "mod", replacement: "|$0|$1",      options: "mA" },
    // { trigger: "(",   replacement: "(${VISUAL})", options: "mvA" },
    // { trigger: "[",   replacement: "[${VISUAL}]", options: "mvA" },
    // { trigger: "{",   replacement: "{${VISUAL}}", options: "mvA" },
    { trigger: "(",   replacement: "($0)$1",      options: "mA" },
    { trigger: "[",   replacement: "[$0]$1",      options: "mA" },
    { trigger: "{",   replacement: "{$0}$1",      options: "mA" },
    {
        trigger: "vert",
        replacement: "\\lvert $0 \\rvert$1",
        options: "m"
    }, {
        trigger: "brack",
        replacement: "\\lbrack $0 \\rbrack$1",
        options: "m"
    },



    // bar overline
    { trigger: "bar",      replacement: "\\bar{$0}$1",      options: "m" },
    { trigger: "overline", replacement: "\\overline{$0}$1", options: "m" },

    // Text environment
    { trigger: "text", replacement: "\\text{$0}$1", options: "mA" },
    { trigger: "\"",   replacement: "\\text{$0}$1", options: "mA" },



    // Symbols
    { trigger: "ooo",    replacement: "\\infty",                            options: "m" },
    // { trigger: "sum",    replacement: "\\sum",                              options: "m" },
    // { trigger: "prod",   replacement: "\\prod",                             options: "m" },
    { trigger: "\\sum",  replacement: "\\sum_{${0:i}=${1:1}}^{${2:N}} $3",  options: "m" },
    { trigger: "\\prod", replacement: "\\prod_{${0:i}=${1:1}}^{${2:N}} $3", options: "m" },

    { trigger: "+-",   replacement: "\\pm",       options: "mA" },
    { trigger: "-+",   replacement: "\\mp",       options: "mA" },
    { trigger: "...",  replacement: "\\dots",     options: "mA" },
    { trigger: "nabl", replacement: "\\nabla",    options: "mA" },
    { trigger: "xx",   replacement: "\\times",    options: "mA" },
    { trigger: "**",   replacement: "\\cdot",     options: "mA" },
    { trigger: "para", replacement: "\\parallel", options: "mA" },

    { trigger: "===",  replacement: "\\equiv",  options: "mA" },
    { trigger: "!=",   replacement: "\\neq",    options: "mA" },
    { trigger: ">=",   replacement: "\\geq",    options: "mA" },
    { trigger: "<=",   replacement: "\\leq",    options: "mA" },
    { trigger: ">>",   replacement: "\\gg",     options: "mA" },
    { trigger: "<<",   replacement: "\\ll",     options: "mA" },
    { trigger: "simm", replacement: "\\sim",    options: "mA" },  
    { trigger: "sim=", replacement: "\\simeq",  options: "mA" },
    { trigger: "prop", replacement: "\\propto", options: "mA" },

    { trigger: "<->", replacement: "\\leftrightarrow ", options: "mA" },
    { trigger: "->",  replacement: "\\to",              options: "mA" },
    { trigger: "!>",  replacement: "\\mapsto",          options: "mA" },
    { trigger: "=>",  replacement: "\\implies",         options: "mA" },  
    { trigger: "=<",  replacement: "\\impliedby",       options: "mA" },

    { trigger: "and",    replacement: "\\cap",        options: "mA" },
    { trigger: "orr",    replacement: "\\cup",        options: "mA" },
    { trigger: "inn",    replacement: "\\in",         options: "mA" },
    { trigger: "notin",  replacement: "\\not\\in",    options: "mA" },
    { trigger: "\\\\\\", replacement: "\\setminus",   options: "mA" },
    { trigger: "sub=",   replacement: "\\subseteq",   options: "mA" },
    { trigger: "sup=",   replacement: "\\supseteq",   options: "mA" },
    { trigger: "eset",   replacement: "\\emptyset",   options: "mA" },
    { trigger: "set",    replacement: "\\{ $0 \\}$1", options: "mA" },
    { trigger: "exists", replacement: "\\exists",     options: "mA", priority: 1 },

    // Limits, Derivatives and Integrals
    { trigger: "lim",          replacement: "\\lim_{{$0}\\to{$1}} $2",                                options: "m" },
    { trigger: /(?<!\\)int/,   replacement: "\\int",                                                  options: "rmA", priority: -1 },
    { trigger: "\\int",        replacement: "\\int$0 \\, \\mathrm{d}${1:x} $2",                       options: "m" },
    { trigger: "dint",         replacement: "\\int_{${0:0}}^{${1:1}} $2 \\, \\mathrm{d}${3:x} $4",    options: "mA" },
    { trigger: "oint",         replacement: "\\oint",                                                 options: "mA" },
    { trigger: "iint",         replacement: "\\iint",                                                 options: "mA" },
    { trigger: "iiint",        replacement: "\\iiint",                                                options: "mA" },
    { trigger: "oinf",         replacement: "\\int_{0}^{\\infty} $0 \\, \\mathrm{d}${1:x} $2",        options: "mA" },
    { trigger: "infi",         replacement: "\\int_{-\\infty}^{\\infty} $0 \\, \\mathrm{d}${1:x} $2", options: "mA" },

    // Trigonometry
    {
        trigger: /(?<!\\)(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)/,
        replacement: "\\[[0]]",
        options: "rmA"
    }, {
        trigger: /\\(arcsin|sin|arccos|cos|arctan|tan|csc|sec|cot)([A-Za-gi-z])/,
        replacement: "\\[[0]] [[1]]",
        options: "rmA",
    }, {
        trigger: /\\(sinh|cosh|tanh|coth)([A-Za-z])/,
        replacement: "\\[[0]] [[1]]",
        options: "rmA",
    }, {
        trigger: /(arccsc|arcsec|arccot)/,
        replacement: "\\operatorname{[[0]]}$0",
        options: "mA",
        priority: 1
    },
    
    // Symbols
    { trigger: "frac", replacement: "\\frac{$0}{$1}$2",        options: "m" },
    { trigger: "sqrt", replacement: "\\sqrt\\[$1\\]{$0}$2",    options: "m" },



    // Font
    { trigger: "frm",  replacement: "\\mathrm{$0}$1",  options: "m", },
    { trigger: "fbb",  replacement: "\\mathbb{$0}$1",  options: "m", },
    { trigger: "fcal", replacement: "\\mathcal{$0}$1", options: "m", },
    { trigger: "fbf",  replacement: "\\mathbf{$0}$1",  options: "m", },
    // \bigr \Bigr \biggr \Biggr
    { trigger: "bgr",   replacement: "\\bigr$0",  options: "m" },
    { trigger: "bgrr",  replacement: "\\Bigr$0",  options: "m" },
    { trigger: "bggr",  replacement: "\\biggr$0", options: "m" },
    { trigger: "bggrr", replacement: "\\Biggr$0", options: "m" },



    // LaTeX-like Theorem & Equation Referencer
    { trigger: "axm",         replacement: "> [!axiom|${1:*}] $0\n> $2$3",       options: "t" },
    { trigger: "axiom",       replacement: "> [!axiom|${1:*}] $0\n> $2$3",       options: "t" },
    { trigger: "thm",         replacement: "> [!theorem|${1:*}] $0\n> $2$3",     options: "t" },
    { trigger: "theorem",     replacement: "> [!theorem|${1:*}] $0\n> $2$3",     options: "t" },
    { trigger: "prp",         replacement: "> [!proposition|${1:*}] $0\n> $2$3", options: "t" },
    { trigger: "proposition", replacement: "> [!proposition|${1:*}] $0\n> $2$3", options: "t" },
    { trigger: "cor",         replacement: "> [!corollary|${1:*}] $0\n> $2$3",   options: "t" },
    { trigger: "corollary",   replacement: "> [!corollary|${1:*}] $0\n> $2$3",   options: "t" },
    { trigger: "def",         replacement: "> [!definition|${1:*}] $0\n> $2$3",  options: "t" },
    { trigger: "definition",  replacement: "> [!definition|${1:*}] $0\n> $2$3",  options: "t" },
    { trigger: "exm",         replacement: "> [!example|${1:*}] $0\n> $2$3",     options: "t" },
    { trigger: "example",     replacement: "> [!example|${1:*}] $0\n> $2$3",     options: "t" },
    // \tag{}
    { trigger: "tag", replacement: "\\tag{$0}$1", options: "m" },



    // // TikZJax
    // {
    //     trigger: "tikzpicture",
    //     replacement: [
    //         "```tikz",
    //         "\\begin{document}",
    //         "\\begin{tikzpicture}[>=stealth, scale=1.2]",
    //         "",
    //         "\t\\definecolor{curveblue}{HTML}{2A6F97}   % 1. 经典蓝 (原 themeblue，默认主曲线)",
    //         "\t\\definecolor{curveorange}{HTML}{D96B27} % 2. 暖赤橙 (互补色，对比最明显)",
    //         "\t\\definecolor{curveteal}{HTML}{0D9488}   % 3. 墨青色 (冷色调延伸)",
    //         "\t\\definecolor{curvered}{HTML}{9E2A2B}    % 4. 绯红色 (高亮/重点强调曲线)",
    //         "\t\\definecolor{curvegreen}{HTML}{386641}  % 5. 苔绿色 (自然稳重)",
    //         "\t\\definecolor{curvepurple}{HTML}{5E548E} % 6. 暮紫色 (优雅暗色调)",
    //         "\t\\definecolor{curveyellow}{HTML}{B47200} % 7. 赭黄色 (高亮度差异曲线)",
    //         "\t\\definecolor{curverust}{HTML}{9C4A2F}   % 8. 赭石棕 (复古暖暗色)",
    //         "",
    //         "\t\\definecolor{themeslate}{HTML}{475569} % 坐标系",
    //         "\t\\definecolor{themegrid}{HTML}{E2E8F0}  % 网格",
    //         "\t\\definecolor{themefill}{HTML}{E6EEF5}  % 填充",
    //         "\t\\definecolor{themebkg}{HTML}{F4F6F8}   % 文字背景填充",
    //         "",
    //         "\t% 网格",
    //         "\t% \\draw[step=1cm, color=themegrid, thin] (-3.5,-3.5) grid (3.5,3.5);",
    //         "\t% x轴",
    //         "\t\\draw[->, color=themeslate, thick] (-3.8,0) -- (3.8,0) node[right, font=\\small] {$x$};",
    //         "\t% y轴",
    //         "\t\\draw[->, color=themeslate, thick] (0,-3.8) -- (0,3.8) node[above, font=\\small] {$y$};",
    //         "\t% 原点",
    //         "\t\\node[color=themeslate, below left, font=\\scriptsize] at (0,0) {${0}}; ",
    //         "",
    //         "\t$0",
    //         "",
    //         "\t% x轴刻度",
    //         "\t% \\foreach \\x in {-1,1}",
    //         "\t% \\draw[color=themeslate] (\\x,2pt) -- (\\x,-2pt) node[below, font=\\scriptsize] {$\\x$};",
    //         "\t% y轴刻度",
    //         "\t% \\foreach \\y in {-1,1}",
    //         "\t% \\draw[color=themeslate] (2pt,\\y) -- (-2pt,\\y) node[left, font=\\scriptsize] {$\\y$};",
    //         "",
    //         "\\end{tikzpicture}",
    //         "\\end{document}",
    //         "```",
    //         "$1"
    //     ].join("\n"),
    //     options: "t"
    // }, {
    //     trigger: "pgfplots",
    //     replacement: [
    //         "```tikz",
    //         "\\usepackage{pgfplots}%\\pgfplotsset{compat=1.18}",
    //         "\\begin{document}",
    //         "\\begin{tikzpicture}[>=stealth, scale=1.2]",
    //         "",
    //         "\t\\definecolor{curveblue}{HTML}{2A6F97}   % 1. 经典蓝 (原 themeblue，默认主曲线)",
    //         "\t\\definecolor{curveorange}{HTML}{D96B27} % 2. 暖赤橙 (互补色，对比最明显)",
    //         "\t\\definecolor{curveteal}{HTML}{0D9488}   % 3. 墨青色 (冷色调延伸)",
    //         "\t\\definecolor{curvered}{HTML}{9E2A2B}    % 4. 绯红色 (高亮/重点强调曲线)",
    //         "\t\\definecolor{curvegreen}{HTML}{386641}  % 5. 苔绿色 (自然稳重)",
    //         "\t\\definecolor{curvepurple}{HTML}{5E548E} % 6. 暮紫色 (优雅暗色调)",
    //         "\t\\definecolor{curveyellow}{HTML}{B47200} % 7. 赭黄色 (高亮度差异曲线)",
    //         "\t\\definecolor{curverust}{HTML}{9C4A2F}   % 8. 赭石棕 (复古暖暗色)",
    //         "",
    //         "\t\\definecolor{themeslate}{HTML}{475569} % 坐标系",
    //         "\t\\definecolor{themegrid}{HTML}{E2E8F0}  % 网格",
    //         "\t\\definecolor{themefill}{HTML}{E6EEF5}  % 填充",
    //         "\t\\definecolor{themebkg}{HTML}{F4F6F8}   % 文字背景填充",
    //         "",
    //         "\t% 网格",
    //         "\t% \\draw[step=1cm, color=themegrid, thin] (-3.5,-3.5) grid (3.5,3.5);",
    //         "\t% x轴",
    //         "\t\\draw[->, color=themeslate, thick] (-3.8,0) -- (3.8,0) node[right, font=\\small] {$x$};",
    //         "\t% y轴",
    //         "\t\\draw[->, color=themeslate, thick] (0,-3.8) -- (0,3.8) node[above, font=\\small] {$y$};",
    //         "\t% 原点",
    //         "\t\\node[color=themeslate, below left, font=\\scriptsize] at (0,0) {${0}}; ",
    //         "",
    //         "\t$0",
    //         "",
    //         "\t% x轴刻度",
    //         "\t% \\foreach \\x in {-1,1}",
    //         "\t% \\draw[color=themeslate] (\\x,2pt) -- (\\x,-2pt) node[below, font=\\scriptsize] {$\\x$};",
    //         "\t% y轴刻度",
    //         "\t% \\foreach \\y in {-1,1}",
    //         "\t% \\draw[color=themeslate] (2pt,\\y) -- (-2pt,\\y) node[left, font=\\scriptsize] {$\\y$};",
    //         "",
    //         "\\end{tikzpicture}",
    //         "\\end{document}",
    //         "```",
    //         "$1"
    //     ].join("\n"),
    //     options: "t",
    // },



    // {
    //     trigger: "tayl",
    //     replacement: "${0:f}(${1:x} + ${2:h}) = ${0:f}(${1:x}) + ${0:f}'(${1:x})${2:h} + ${0:f}''(${1:x}) \\frac{${2:h}^{2}}{2!} + \\dots$3",
    //     options: "mA",
    //     description: "Taylor expansion"
    // },

    // {
    //     trigger: /iden(\d)/,
    //     replacement: (match) => {
    //         const n = match[1];

    //         let arr = [];
    //         for (let j = 0; j < n; j++) {
    //             arr[j] = [];
    //             for (let i = 0; i < n; i++) { arr[j][i] = (i === j) ? 1 : 0; }
    //         }

    //         let output = arr.map(el => el.join(" & ")).join(" \\\\\n");
    //         output = `\\begin{pmatrix}\n${output}\n\\end{pmatrix}`;

    //         return output;
    //     },
    //     options: "mA",
    //     description: "N x N identity matrix"
    // },

    // {
    //     trigger: /(?<=(?:\n|^)[ \t]*>*)(?<marker>\d+[.)]|[-*+])(?<whitespace>[ \t]+)(?<text>.*)dm/,
    //     replacement: (m) => {
    //         const { whitespace, text, marker } = m.groups;
    //         const firstLine = marker + whitespace + text;
    //         const indent = " ".repeat(marker.length) + whitespace;
    //         return `${firstLine}\n${indent}$$\n${indent}\t$0\n${indent}$$`;
    //     },
    //     options: "rtA",
    //     priority: 2,
    //     description: "Display math when in a list"
    // },

]