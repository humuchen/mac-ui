/**
 * 暗色模式静态审计脚本
 * 提取每个组件 CSS 中硬编码的颜色字面量及其选择器上下文，
 * 标记暗色模式下可能出现对比度问题的项。
 *
 * 用法: node scripts/dark-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const COMPONENTS_DIR = new URL('../src/components', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')

// 已知在暗色模式下仍然正确的颜色（如彩色底上的白字、暗色底上的浅字、语义高亮色）
const ALWAYS_OK = [
  '#fff', '#ffffff', // 白字（通常在彩色/暗色背景上）
  '#ff5f57', '#febc2e', '#28c840', // 红绿灯按钮
  '#ff3b30', // 系统红
  '#4d0000', '#995700', '#006500', // 红绿灯描边
]

// 亮色模式的文字/背景色，暗色下需要适配
const LIGHT_ONLY_HINTS = [
  '#1f2937', '#1d1d1f', '#1d4ed8', '#111827', '#374151',
  '#6b7280', '#9ca3af', '#d1d5db', '#f9fafb', '#f3f4f6',
  '#e5e7eb', '#f8fafc', '#f1f5f9', '#e2e8f0', '#0f172a',
  '#15803d', '#16a34a', '#b45309', '#d97706', '#b91c1c', '#dc2626',
  '#0058d0', '#4b5563', '#98989d', '#86868b', '#f5f5f7', '#2c2c2e',
  '#007aff', '#0a84ff', '#5e5ce6', '#bf5af2', '#16213e', '#1a1a2e',
  '#6e6e73', '#8e8ea0',
]

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (entry.endsWith('.ts') && !entry.includes('.stories') && !entry.includes('.test')) yield full
  }
}

// 从 TS 源码中提取 css`...` 模板字符串内容
function extractCss(source) {
  const blocks = []
  const re = /css`/g
  let m
  while ((m = re.exec(source))) {
    let i = m.index + 4
    let depth = 1 // 反引号内容；遇到 ${ 时跳过插值
    let start = i
    let buf = ''
    while (i < source.length) {
      const ch = source[i]
      if (ch === '\\' && source[i + 1] === '`') {
        buf += source.slice(start, i) + source.slice(i, i + 2)
        i += 2
        start = i
        continue
      }
      if (ch === '`') break
      if (ch === '$' && source[i + 1] === '{') {
        // 跳过整个插值表达式（含嵌套大括号与嵌套模板串）
        let bd = 1
        let j = i + 2
        while (j < source.length && bd > 0) {
          if (source[j] === '{') bd++
          else if (source[j] === '}') bd--
          else if (source[j] === '`') {
            // 嵌套模板
            j++
            while (j < source.length && source[j] !== '`') {
              if (source[j] === '\\') j++
              j++
            }
          }
          j++
        }
        buf += source.slice(start, i) + ' /*INTERP*/'
        i = j
        start = i
        continue
      }
      i++
    }
    buf += source.slice(start, i)
    blocks.push(buf)
  }
  return blocks.join('\n')
}

// 解析 CSS：返回 [{ selector, decls: [{ prop, value, line }] }]
function parseRules(cssText) {
  const rules = []
  // 去掉注释
  const text = cssText.replace(/\/\*[\s\S]*?\*\//g, '')
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(text))) {
    const selector = m[1].trim().replace(/\s+/g, ' ')
    const decls = []
    const dm = /([a-zA-Z-]+)\s*:\s*([^;]+);?/g
    let d
    while ((d = dm.exec(m[2]))) {
      decls.push({ prop: d[1].trim(), value: d[2].trim() })
    }
    rules.push({ selector, decls })
  }
  return rules
}

const COLOR_RE = /(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black|red|green|blue|orange|gray|grey|yellow|transparent)\b(?![\w-]))/g

const results = []
for (const file of walk(COMPONENTS_DIR)) {
  const name = basename(file, '.ts')
  if (!name.startsWith('mac-')) continue
  const source = readFileSync(file, 'utf8')
  const cssText = extractCss(source)
  const rules = parseRules(cssText)

  // 找到 dark 块的声明集合
  const darkDecls = new Set()
  const lightOnlyDecls = new Set() // (prop|value) 在亮色规则中
  const findings = []

  for (const rule of rules) {
    const isDark = rule.selector.includes("data-theme='dark'") || rule.selector.includes('data-theme="dark"')
    for (const decl of rule.decls) {
      const key = `${rule.selector}::${decl.prop}`
      if (isDark) {
        darkDecls.add(decl.prop)
      }
    }
  }

  for (const rule of rules) {
    const isDark = rule.selector.includes("data-theme='dark'") || rule.selector.includes('data-theme="dark"')
    if (isDark) continue
    for (const decl of rule.decls) {
      if (!/(background|color|border|fill|stroke|shadow|outline|caret)/.test(decl.prop)) continue
      if (/var\(/.test(decl.value)) {
        // var() 引用：检查引用的变量是否有 dark 覆盖
        const vars = decl.value.match(/--md-[\w-]+/g) || []
        for (const v of vars) {
          const darkVar = `${v}-dark`
          const hasDarkToken =
            darkDecls.has(v) || // 组件 dark 块直接覆盖
            source.includes(`${v}:`) === false || // 非本组件定义
            source.includes(`${darkVar}`) // 组件定义了 -dark 变体
          // 非本组件定义的 var 来自 theme.ts，theme.ts 的 dark 块覆盖情况另行人工判断
          if (source.includes(`${v}:`) && !darkDecls.has(v) && !source.includes(darkVar)) {
            findings.push({ selector: rule.selector, prop: decl.prop, value: decl.value, kind: 'var-no-dark-override', varName: v })
          }
        }
        continue
      }
      // 字面量颜色
      const colors = decl.value.match(COLOR_RE)
      if (!colors) continue
      for (const c of colors) {
        if (ALWAYS_OK.includes(c.toLowerCase())) continue
        const suspicious = LIGHT_ONLY_HINTS.some((h) => c.toLowerCase() === h)
        findings.push({
          selector: rule.selector,
          prop: decl.prop,
          value: decl.value,
          kind: suspicious ? 'light-only-literal' : 'literal',
          color: c,
        })
      }
    }
  }

  if (findings.length) {
    results.push({ component: name, file, findings })
  }
}

for (const r of results) {
  console.log(`\n=== ${r.component} (${r.file.replace(/\\/g, '/')}) ===`)
  const seen = new Set()
  for (const f of r.findings) {
    const key = `${f.kind}|${f.selector}|${f.prop}|${f.value}`
    if (seen.has(key)) continue
    seen.add(key)
    const tag = f.kind === 'var-no-dark-override' ? `[VAR ${f.varName}]` : `[${f.color}]`
    console.log(`  ${tag} ${f.selector} { ${f.prop}: ${f.value} }`)
  }
}
console.log(`\n审计完成：${results.length} 个组件存在待确认项`)
