export default {
    "${DELIM_CHARACTER}": "(?:\\(|\\)|\\[|\\]|\\{|\\}|<|>|\\|)",
    "${DELIM_COMMAND}":   "(?:lbrack|rbrack|lbrace|rbrace|lvert|rvert|lVert|rVert|langle|rangle|lslash|rslash|lceil|rceil|lfloor|rfloor|lgroup|rgroup|lmoustache|rmoustache)",
    
    "${MACRO_OP}": "(?:sum|prod|coprod|bigvee|bigwedge|bigcup|bigcap|bigsqcup|biguplus|bigodot|bigoplus|bigotimes|int|oint|iint|iiint|iiiint|idotsint)",
    
    "${FRACTION}": "(?:frac|dfrac|tfrac|cfrac|genfrac)",
    "${BINOMIAL}": "(?:binom|dbinom|tbinom)",

    "${ENV_ALIGN}":    "(?:align|align\\*|aligned|flalign|flalign\\*)",
    "${ENV_MATRIX}":   "(?:matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|smallmatrix)",
    "${ENV_CASES}":    "(?:cases|cases\\*|dcases|dcases\\*|rcases|rcases\\*|drcases|drcases\\*)",
    "${ENV_GATHMULT}": "(?:gather|gather\\*|gathered|multline|multline\\*|multlined|split)",
    "${ENV_OTHER}":    "(?:equation|array)",

    "${THEOREM_ENVIRONMENT}": "(?:axiom|theorem|proposition|corollary|definition|example)",
    "${THEOREM_ENV}":         "(?:axm|thm|prp|cor|def|exm)",
}
