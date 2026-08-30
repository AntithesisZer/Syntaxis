export default {
    "${DELIM_CHARACTER}": "(?:\\(|\\)|\\[|\\]|\\{|\\}|<|>|\\|)",
    "${DELIM_COMMAND}":   "(?:lbrack|rbrack|lbrace|rbrace|lvert|rvert|lVert|rVert|langle|rangle|lslash|rslash|lceil|rceil|lfloor|rfloor|lgroup|rgroup|lmoustache|rmoustache)",
    
    "${MACRO_OP}": "(?:sum|prod|coprod|bigvee|bigwedge|bigcup|bigcap|bigsqcup|biguplus|bigodot|bigoplus|bigotimes|int|oint|iint|iiint|iiiint|idotsint)",
    "${FRACTION}": "(?:frac|dfrac|tfrac|cfrac|genfrac)",
    "${BINOMIAL}": "(?:binom|dbinom|tbinom)",

    "${ENV_ALIGN}":    "(?:align|aligned|flalign)",
    "${ENV_MATRIX}":   "(?:matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|smallmatrix)",
    "${ENV_CASES}":    "(?:cases|dcases|rcases|drcases)",
    "${ENV_GATHMULT}": "(?:gather|gathered|multline|multlined|split)",
    "${ENV_OTHER}":    "(?:equation)",
}

// export default {
//     "${GREEK}": "(?:alpha|beta|gamma|Gamma|delta|Delta|epsilon|varepsilon|zeta|eta|theta|vartheta|Theta|iota|kappa|lambda|Lambda|mu|nu|xi|omicron|pi|rho|varrho|sigma|Sigma|tau|upsilon|Upsilon|phi|varphi|Phi|chi|psi|omega|Omega)",
//     "${SYMBOL}": "(?:parallel|perp|partial|nabla|hbar|ell|infty|oplus|ominus|otimes|oslash|square|star|dagger|vee|wedge|subseteq|subset|supseteq|supset|emptyset|exists|nexists|forall|implies|impliedby|iff|setminus|neg|lor|land|bigcup|bigcap|cdot|times|simeq|approx)",
//     "${MORE_SYMBOLS}": "(?:leq|geq|neq|gg|ll|equiv|sim|propto|rightarrow|leftarrow|Rightarrow|Leftarrow|leftrightarrow|to|mapsto|cap|cup|in|sum|prod|exp|ln|log|det|dots|vdots|ddots|pm|mp|int|iint|iiint|oint)",
//     "${ACCENT}": "(?:dot|ddot|hat|bar|tilde|vec|underline|overline|mathbf|mathcal|mathrm|mathbb)",
// }
