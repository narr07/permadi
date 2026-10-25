/**
 * Situs tidak merender LaTeX, jadi rumus sederhana dari model ($x^2$, $\rightarrow$, $\frac{a}{b}$)
 * diubah menjadi teks + simbol Unicode. Blok kode dan inline code tidak disentuh.
 */

const SYMBOLS = {
	'\\Rightarrow': '⇒',
	'\\rightarrow': '→',
	'\\leftarrow': '←',
	'\\to': '→',
	'\\times': '×',
	'\\div': '÷',
	'\\pm': '±',
	'\\cdot': '·',
	'\\leq': '≤',
	'\\geq': '≥',
	'\\le': '≤',
	'\\ge': '≥',
	'\\neq': '≠',
	'\\approx': '≈',
	'\\infty': '∞',
	'\\degree': '°',
	'\\circ': '°',
	'\\pi': 'π',
	'\\alpha': 'α',
	'\\beta': 'β',
	'\\theta': 'θ',
	'\\Delta': 'Δ',
	'\\%': '%',
	'\\,': ' ',
	'\\;': ' ',
	'\\quad': ' ',
}
const SYMBOL_KEYS = Object.keys(SYMBOLS).sort((a, b) => b.length - a.length)

const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'm': 'ᵐ', 'x': 'ˣ', 'y': 'ʸ', 'i': 'ⁱ', 'a': 'ᵃ', 'b': 'ᵇ', 'k': 'ᵏ' }
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' }

const toScript = (text, map, marker) => [...text].every(c => map[c]) ? [...text].map(c => map[c]).join('') : `${marker}(${text})`
const group = text => /^[\w.]+$/.test(text) ? text : `(${text})`

function convert(expr) {
	let s = expr
		.replace(/\\(?:text|mathrm|mathbf|textbf)\{([^{}]*)\}/g, '$1')
		.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => `${group(a)}/${group(b)}`)
		.replace(/\\sqrt\{([^{}]*)\}/g, '√$1')
	for (const key of SYMBOL_KEYS)
		s = s.split(key).join(SYMBOLS[key])
	s = s
		.replace(/\^\{([^{}]*)\}/g, (_, e) => toScript(e, SUP, '^'))
		.replace(/\^(\w)/g, (_, e) => toScript(e, SUP, '^'))
		.replace(/_\{([^{}]*)\}/g, (_, e) => toScript(e, SUB, '_'))
		.replace(/_(\d)/g, (_, e) => toScript(e, SUB, '_'))
		.replace(/[{}\\]/g, '')
	return s.replace(/\s+/g, ' ').trim()
}

// $...$: isi tidak diawali/diakhiri spasi dan $ penutup tidak diikuti angka, agar harga ("$5 to $10") aman
const INLINE_MATH = /(`[^`\n]*`)|\$\$([^$\n]+)\$\$|\$(?=\S)([^$\n]*?\S)\$(?!\d)/g

export function latexToText(markdown) {
	let inFence = false
	return markdown.split('\n').map((line) => {
		if (/^\s*```/.test(line)) {
			inFence = !inFence
			return line
		}
		if (inFence)
			return line
		return line.replace(INLINE_MATH, (match, code, block, inline) => code ?? convert(block ?? inline))
	}).join('\n')
}
