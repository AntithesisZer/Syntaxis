const DELIMITER_PAIRS = [
    { trigger_delim: "(", left_delim: "(", right_delim: ")" },
    { trigger_delim: "[", left_delim: "[", right_delim: "]" },
    { trigger_delim: "brack", left_delim: "\\lbrack", right_delim: "\\rbrack" },
    { trigger_delim: "{", left_delim: "{", right_delim: "}" },
    { trigger_delim: "\\{", left_delim: "\\{", right_delim: "\\}" },
    { trigger_delim: "brace", left_delim: "\\lbrace", right_delim: "\\rbrace" },
    { trigger_delim: "<", left_delim: "<", right_delim: ">" },
    { trigger_delim: "|", left_delim: "|", right_delim: "|" },
    { trigger_delim: "vert", left_delim: "\\lvert", right_delim: "\\rvert" },
    { trigger_delim: "\\|", left_delim: "\\|", right_delim: "\\|" },
    { trigger_delim: "Vert", left_delim: "\\lVert", right_delim: "\\rVert" },
    { trigger_delim: "angle", left_delim: "\\langle", right_delim: "\\rangle" },
    { trigger_delim: "slash", left_delim: "/", right_delim: "\\backslash" },
    { trigger_delim: "ceil", left_delim: "\\lceil", right_delim: "\\rceil" },
    { trigger_delim: "floor", left_delim: "\\lfloor", right_delim: "\\rfloor" },
    { trigger_delim: "group", left_delim: "\\lgroup", right_delim: "\\rgroup" },
    { trigger_delim: "moustache", left_delim: "\\lmoustache", right_delim: "\\rmoustache" },
];
const MACRO_OP = "sum|prod|coprod|bigvee|bigwedge|bigcup|bigcap|bigsqcup|biguplus|bigodot|bigoplus|bigotimes|int|oint|iint|iiint|iiiint|idotsint";
const FRACTION = "frac|dfrac|tfrac|cfrac|genfrac";
const BINOMIAL = "binom|dbinom|tbinom";
const ENV_TALL = "(?:[pPbBvV]?matrix|smallmatrix|cases|dcases|rcases|drcases|array|aligned|gathered|split)\\*?";
const TALL_SYMBOLS = `\\\\(?:${MACRO_OP}|${FRACTION}|${BINOMIAL}|sqrt|begin\\{${ENV_TALL}\\})`;

function escapeRegex(str) {
    if (!str) return "";
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const generatedDelimiterSnippets = [];

DELIMITER_PAIRS.forEach(({ trigger_delim, left_delim, right_delim }) => {
    const leftDisplay = left_delim ? (left_delim.startsWith("\\") && left_delim.length > 2 ? `${left_delim} ` : left_delim) : "";
    const rightDisplay = right_delim ? (right_delim.startsWith("\\") && right_delim.length > 2 ? ` ${right_delim}` : right_delim) : "";

    generatedDelimiterSnippets.push({
        trigger: trigger_delim,
        replacement: `${leftDisplay}$0${rightDisplay}$1`,
        options: "m",
        description: `Expand ${trigger_delim}`
    });

    generatedDelimiterSnippets.push({
        trigger: trigger_delim,
        replacement: `${leftDisplay}[[0]]$0${rightDisplay}$1`,
        options: "mV",
        description: `Wrap selection with ${trigger_delim}`
    });

    const leftPat = escapeRegex(left_delim);
    const rightPat = escapeRegex(right_delim);

    let autoEnlargeRegex = "";
    let lReplacement = left_delim ? `\\left${left_delim} ` : "\\left. ";
    let rReplacement = right_delim ? ` \\right${right_delim}` : " \\right.";

    if (left_delim && right_delim) {
        autoEnlargeRegex = `(?<!\\\\left\\s*)${leftPat}((?:(?!${leftPat}|${rightPat})[^\\n])*?${TALL_SYMBOLS}(?:(?!${leftPat}|${rightPat})[^\\n])*?)${rightPat}(?!\\s*\\\\right)`;
    } else if (!left_delim && right_delim) {
        autoEnlargeRegex = `(?<!\\\\left\\.\\s*)((?:(?!${rightPat})[^\\n$=])*?${TALL_SYMBOLS}(?:(?!${rightPat})[^\\n$])*?)${rightPat}(?!\\s*\\\\right)`;
    } else if (left_delim && !right_delim) {
        autoEnlargeRegex = `(?<!\\\\left\\s*)${leftPat}((?:(?!${leftPat})[^\\n$=])*?${TALL_SYMBOLS}(?:(?!${leftPat})[^\\n$])*?)(?!\\s*\\\\right\\.)`;
    }

    if (autoEnlargeRegex) {
        generatedDelimiterSnippets.push({
            trigger: autoEnlargeRegex,
            replacement: `${lReplacement}$0${rReplacement}$1`,
            options: "rm",
            description: `Auto-enlarge delimiters for ${trigger_delim}`
        });
    }
});



export default [
    ...generatedDelimiterSnippets,


    // MathJax Block
    { trigger: "$",  replacement: "$$0$$1",       options: "t", priority: 1 },
    { trigger: "$$", replacement: "$$\n$0\n$$$1", options: "t", priority: 2 },
    
    
    // Text environment
    { trigger: "text", replacement: "\\text{$0}$1", options: "mA" },
    { trigger: "\"",   replacement: "\\text{$0}$1", options: "mA" },


    // Text Font
    { trigger: "tfnor", replacement: "\\textnormal{$0}$1", options: "mA", }, // Normal
    { trigger: "tfrm",  replacement: "\\textrm{$0}$1",     options: "mA", }, // Roman
    { trigger: "tfss",  replacement: "\\textsf{$0}$1",     options: "mA", }, // Sans Serif
    { trigger: "tftt",  replacement: "\\texttt{$0}$1",     options: "mA", }, // Typewriter
    // { trigger: "tfmd",  replacement: "\\textmd{$0}$1",     options: "mA", }, // Medium
    { trigger: "tfbf",  replacement: "\\textbf{$0}$1",     options: "mA", }, // Bold
    { trigger: "tfup",  replacement: "\\textup{$0}$1",     options: "mA", }, // Upright
    { trigger: "tfit",  replacement: "\\textit{$0}$1",     options: "mA", }, // Italic
    // { trigger: "tfsl",  replacement: "\\textsl{$0}$1",     options: "mA", }, // Slanted
    // { trigger: "tfsc",  replacement: "\\textsc{$0}$1",     options: "mA", }, // Small Caps
    // Math Font
    { trigger: "mfnor", replacement: "\\mathnormal{$0}$1", options: "mA", }, // Normal
    { trigger: "mfrm",  replacement: "\\mathrm{$0}$1",     options: "mA", }, // Roman
    { trigger: "mfsf",  replacement: "\\mathsf{$0}$1",     options: "mA", }, // Sans Serif
    { trigger: "mftt",  replacement: "\\mathtt{$0}$1",     options: "mA", }, // Typewriter
    // { trigger: "mfmd",  replacement: "\\mathmd{$0}$1",     options: "mA", }, // Medium
    { trigger: "mfbf",  replacement: "\\mathbf{$0}$1",     options: "mA", }, // Bold
    { trigger: "mfbm",  replacement: "\\boldsymbol{$0}$1", options: "mA", }, // Bold Symbol
    { trigger: "mfup",  replacement: "\\mathup{$0}$1",     options: "mA", }, // Upright
    { trigger: "mfit",  replacement: "\\mathit{$0}$1",     options: "mA", }, // Italic
    // { trigger: "mfsl",  replacement: "\\mathsl{$0}$1",     options: "mA", }, // Slanted
    // { trigger: "mfsc",  replacement: "\\mathsc{$0}$1",     options: "mA", }, // Small Caps
    { trigger: "mfcal", replacement: "\\mathcal{$0}$1",    options: "mA", }, // Calligraphic
    { trigger: "mfbb",  replacement: "\\mathbb{$0}$1",     options: "mA", }, // Blackboard
    { trigger: "mfrak", replacement: "\\mathfrak{$0}$1",   options: "mA", }, // Fraktur

    // Font Size
    { trigger: "tiny",       replacement: "{\\tiny $0}$1",         options: "mA" }, // tiny font
    { trigger: "scriptsz",   replacement: "{\\scriptsize $0}$1",   options: "mA" }, // very small font
    // { trigger: "footnotesz", replacement: "{\\footnotesize $0}$1", options: "mA" }, // quite small font
    { trigger: "small",      replacement: "{\\small $0}$1",        options: "mA" }, // small font
    { trigger: "normalsz",   replacement: "{\\normalsize $0}$1",   options: "mA" }, // normal font
    { trigger: "large",      replacement: "{\\large $0}$1",        options: "mA" }, // large font
    { trigger: "Large",      replacement: "{\\Large $0}$1",        options: "mA" }, // larger font
    { trigger: "LARGE",      replacement: "{\\LARGE $0}$1",        options: "mA" }, // very large font
    { trigger: "huge",       replacement: "{\\huge $0}$1",         options: "mA" }, // huge font
    { trigger: "Huge",       replacement: "{\\Huge $0}$1",         options: "mA" }, // hugest font


    // Greek Letters
    { trigger: "@a",  replacement: "\\alpha",      options: "mA" },
    { trigger: "@A",  replacement: "\\mathrm{A}",  options: "mA" },
    { trigger: ":A",  replacement: "\\mathit{A}",  options: "mA" },
    { trigger: "@b",  replacement: "\\beta",       options: "mA" },
    { trigger: "@B",  replacement: "\\mathrm{B}",  options: "mA" },
    { trigger: ":B",  replacement: "\\mathit{B}",  options: "mA" },
    { trigger: "@g",  replacement: "\\gamma",      options: "mA" },
    { trigger: "@G",  replacement: "\\Gamma",      options: "mA" },
    { trigger: ":G",  replacement: "\\varGamma",   options: "mA" },
    { trigger: "@d",  replacement: "\\delta",      options: "mA" },
    { trigger: "@D",  replacement: "\\Delta",      options: "mA" },
    { trigger: ":D",  replacement: "\\varDelta",   options: "mA" },
    { trigger: "@e",  replacement: "\\epsilon",    options: "mA" },
    { trigger: ":e",  replacement: "\\varepsilon", options: "mA" },
    { trigger: "@E",  replacement: "\\mathrm{E}",  options: "mA" },
    { trigger: ":E",  replacement: "\\mathit{E}",  options: "mA" },
    { trigger: "@z",  replacement: "\\zeta",       options: "mA" },
    { trigger: "@Z",  replacement: "\\mathrm{Z}",  options: "mA" },
    { trigger: ":Z",  replacement: "\\mathit{Z}",  options: "mA" },
    { trigger: "@h",  replacement: "\\eta",        options: "mA" },
    { trigger: "@H",  replacement: "\\mathrm{H}",  options: "mA" },
    { trigger: ":H",  replacement: "\\mathit{H}",  options: "mA" },
    { trigger: "@th", replacement: "\\theta",      options: "mA" },
    { trigger: "@Th", replacement: "\\Theta",      options: "mA" },
    { trigger: ":th", replacement: "\\vartheta",   options: "mA" },
    { trigger: ":Th", replacement: "\\varTheta",   options: "mA" },
    { trigger: "@i",  replacement: "\\iota",       options: "mA" },
    { trigger: "@I",  replacement: "\\mathrm{I}",  options: "mA" },
    { trigger: ":I",  replacement: "\\mathit{I}",  options: "mA" },
    { trigger: "@k",  replacement: "\\kappa",      options: "mA" },
    { trigger: ":k",  replacement: "\\varkappa",   options: "mA" },
    { trigger: "@K",  replacement: "\\mathrm{K}",  options: "mA" },
    { trigger: ":K",  replacement: "\\mathit{K}",  options: "mA" },
    { trigger: "@l",  replacement: "\\lambda",     options: "mA" },
    { trigger: "@L",  replacement: "\\Lambda",     options: "mA" },
    { trigger: ":L",  replacement: "\\varLambda",  options: "mA" },
    { trigger: "@m",  replacement: "\\mu",         options: "mA" },
    { trigger: "@M",  replacement: "\\mathrm{M}",  options: "mA" },
    { trigger: ":M",  replacement: "\\mathit{M}",  options: "mA" },
    { trigger: "@n",  replacement: "\\nu",         options: "mA" },
    { trigger: "@N",  replacement: "\\mathrm{N}",  options: "mA" },
    { trigger: ":N",  replacement: "\\mathit{N}",  options: "mA" },
    { trigger: "@x",  replacement: "\\xi",         options: "mA" },
    { trigger: "@X",  replacement: "\\Xi",         options: "mA" },
    { trigger: ":X",  replacement: "\\varXi",      options: "mA" },
    { trigger: "@o",  replacement: "\\omicron",    options: "mA" },
    { trigger: "@O",  replacement: "\\mathrm{O}",  options: "mA" },
    { trigger: ":O",  replacement: "\\mathit{O}",  options: "mA" },
    { trigger: "@pi", replacement: "\\pi",         options: "mA" },
    { trigger: "@Pi", replacement: "\\Pi",         options: "mA" },
    { trigger: ":pi", replacement: "\\varpi",      options: "mA" },
    { trigger: ":Pi", replacement: "\\varPi",      options: "mA" },
    { trigger: "@r",  replacement: "\\rho",        options: "mA" },
    { trigger: ":r",  replacement: "\\varrho",     options: "mA" },
    { trigger: "@R",  replacement: "\\mathrm{P}",  options: "mA" },
    { trigger: ":R",  replacement: "\\mathit{P}",  options: "mA" },
    { trigger: "@s",  replacement: "\\sigma",      options: "mA" },
    { trigger: "@S",  replacement: "\\Sigma",      options: "mA" },
    { trigger: ":s",  replacement: "\\varsigma",   options: "mA" },
    { trigger: ":S",  replacement: "\\varSigma",   options: "mA" },
    { trigger: "@t",  replacement: "\\tau",        options: "mA" },
    { trigger: "@T",  replacement: "\\mathrm{T}",  options: "mA" },
    { trigger: ":T",  replacement: "\\mathit{T}",  options: "mA" },
    { trigger: "@u",  replacement: "\\upsilon",    options: "mA" },
    { trigger: "@U",  replacement: "\\Upsilon",    options: "mA" },
    { trigger: ":U",  replacement: "\\varUpsilon", options: "mA" },
    { trigger: "@ph", replacement: "\\phi",        options: "mA" },
    { trigger: "@Ph", replacement: "\\Phi",        options: "mA" },
    { trigger: ":ph", replacement: "\\varphi",     options: "mA" },
    { trigger: ":Ph", replacement: "\\varPhi",     options: "mA" },
    { trigger: "@ch", replacement: "\\chi",        options: "mA" },
    { trigger: "@Ch", replacement: "\\mathrm{X}",  options: "mA" },
    { trigger: ":Ch", replacement: "\\mathit{X}",  options: "mA" },
    { trigger: "@ps", replacement: "\\psi",        options: "mA" },
    { trigger: "@Ps", replacement: "\\Psi",        options: "mA" },
    { trigger: ":Ps", replacement: "\\varPsi",     options: "mA" },
    { trigger: "@w",  replacement: "\\omega",      options: "mA" },
    { trigger: "@W",  replacement: "\\Omega",      options: "mA" },
    { trigger: ":W",  replacement: "\\varOmega",   options: "mA" },

    
    // Tall Delimiters
    {
        trigger: "(bgr|bgrr|bggr|bggrr)(${DELIM_CHARACTER})",
        replacement: (match) => {
            const sizeMap = {
                "bgr": "\\bigr",
                "bgrr": "\\Bigr",
                "bggr": "\\biggr",
                "bggrr": "\\Biggr"
            };
            return `${sizeMap[match[1]]}{${match[2]}}$0`;
        },
        options: "rmA"
    }, {
        trigger: "(bgr|bgrr|bggr|bggrr)(${DELIM_COMMAND})",
        replacement: (match) => {
            const sizeMap = {
                "bgr": "\\bigr",
                "bgrr": "\\Bigr",
                "bggr": "\\biggr",
                "bggrr": "\\Biggr"
            };
            return `${sizeMap[match[1]]}{\\${match[2]}}$0`;
        },
        options: "rmA"
    },


    // ^{} _{}
    { trigger: "^^",  replacement: "^{$0}$1",     options: "m", priority: 1 },
    { trigger: "^^^", replacement: "{$0}^{$1}$2", options: "m", priority: 2 },
    { trigger: "__",  replacement: "_{$0}$1",     options: "m", priority: 1 },
    { trigger: "___", replacement: "{$0}_{$1}$2", options: "m", priority: 2 },


    // Marco-operators
    { trigger: "*sum",       replacement: "\\sum$0",       options: "m" },
    { trigger: "*prod",      replacement: "\\prod$0",      options: "m" },
    { trigger: "*coprod",    replacement: "\\coprod$0",    options: "m" },
    { trigger: "*bigvee",    replacement: "\\bigvee$0",    options: "m" },
    { trigger: "*bigwedge",  replacement: "\\bigwedge$0",  options: "m" },
    { trigger: "*bigcup",    replacement: "\\bigcup$0",    options: "m" },
    { trigger: "*bigcap",    replacement: "\\bigcap$0",    options: "m" },
    { trigger: "*bigsqcup",  replacement: "\\bigsqcup$0",  options: "m" },
    { trigger: "*bigplus",   replacement: "\\bigplus$0",   options: "m" },
    { trigger: "*bigodot",   replacement: "\\bigodot$0",   options: "m" },
    { trigger: "*bigoplus",  replacement: "\\bigoplus$0",  options: "m" },
    { trigger: "*bigotimes", replacement: "\\bigotimes$0", options: "m" },
    { trigger: "*int",       replacement: "\\int$0",       options: "m" },
    { trigger: "*oint",      replacement: "\\oint$0",      options: "m" },
    { trigger: "*iint",      replacement: "\\iint$0",      options: "m" },
    { trigger: "*iiint",     replacement: "\\iiint$0",     options: "m" },
    { trigger: "*iiiint",    replacement: "\\iiiint$0",    options: "m" },
    { trigger: "*idotsint",  replacement: "\\idotsint$0",  options: "m" },

    // Fractions
    { trigger: "frac",    replacement: "\\frac{$0}{$1}$2",                        options: "m" },
    { trigger: "dfrac",   replacement: "\\dfrac{$0}{$1}$2",                       options: "m" },
    { trigger: "tfrac",   replacement: "\\tfrac{$0}{$1}$2",                       options: "m" },
    { trigger: "cfrac",   replacement: "\\cfrac[$2]{$0}{$1}$3",                   options: "m" },
    { trigger: "genfrac", replacement: "\\genfrac{$4}{$5}{$3}{${2:0}}{$0}{$1}$6", options: "m" },

    // Binomials
    { trigger: "binom",  replacement: "\\binom{$0}{$1}$2",  options: "m" },
    { trigger: "dbinom", replacement: "\\dbinom{$0}{$1}$2", options: "m" },
    { trigger: "tbinom", replacement: "\\tbinom{$0}{$1}$2", options: "m" },





    // // Symbols
    // { trigger: "ooo", replacement: "\\infty", options: "m" },

    // { trigger: "+-",   replacement: "\\pm",       options: "mA" },
    // { trigger: "-+",   replacement: "\\mp",       options: "mA" },
    // { trigger: "...",  replacement: "\\dots",     options: "mA" },
    // { trigger: "nabl", replacement: "\\nabla",    options: "mA" },
    // { trigger: "xx",   replacement: "\\times",    options: "mA" },
    // { trigger: "**",   replacement: "\\cdot",     options: "mA" },
    // { trigger: "para", replacement: "\\parallel", options: "mA" },

    // { trigger: "===",  replacement: "\\equiv",  options: "mA" },
    // { trigger: "!=",   replacement: "\\neq",    options: "mA" },
    // { trigger: ">=",   replacement: "\\geq",    options: "mA" },
    // { trigger: "<=",   replacement: "\\leq",    options: "mA" },
    // { trigger: ">>",   replacement: "\\gg",     options: "mA" },
    // { trigger: "<<",   replacement: "\\ll",     options: "mA" },
    // { trigger: "simm", replacement: "\\sim",    options: "mA" },  
    // { trigger: "sim=", replacement: "\\simeq",  options: "mA" },
    // { trigger: "prop", replacement: "\\propto", options: "mA" },

    // { trigger: "<->", replacement: "\\leftrightarrow ", options: "mA" },
    // { trigger: "->",  replacement: "\\to",              options: "mA" },
    // { trigger: "!>",  replacement: "\\mapsto",          options: "mA" },
    // { trigger: "=>",  replacement: "\\implies",         options: "mA" },  
    // { trigger: "=<",  replacement: "\\impliedby",       options: "mA" },

    // { trigger: "and",    replacement: "\\cap",        options: "mA" },
    // { trigger: "orr",    replacement: "\\cup",        options: "mA" },
    // { trigger: "inn",    replacement: "\\in",         options: "mA" },
    // { trigger: "notin",  replacement: "\\not\\in",    options: "mA" },
    // { trigger: "\\\\\\", replacement: "\\setminus",   options: "mA" },
    // { trigger: "sub=",   replacement: "\\subseteq",   options: "mA" },
    // { trigger: "sup=",   replacement: "\\supseteq",   options: "mA" },
    // { trigger: "eset",   replacement: "\\emptyset",   options: "mA" },
    // { trigger: "set",    replacement: "\\{ $0 \\}$1", options: "mA" },
    // { trigger: "exists", replacement: "\\exists",     options: "mA", priority: 1 },




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
    { trigger: "ntag", replacement: "\\notag",     options: "m" },
    { trigger: "tag",  replacement: "\\tag{$0}$1", options: "m" },


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

]