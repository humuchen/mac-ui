import { css, CSSResult } from 'lit'

/**
 * 动画分类
 */
export type AnimationCategory = 'fade' | 'scale' | 'rotate' | 'slide' | 'bounce' | 'special'

/**
 * 单个动画定义
 */
export interface AnimationDefinition {
  /** 动画名称（用于 type 属性匹配） */
  name: string
  /** 效果描述 */
  description: string
  /** 所属分类 */
  category: AnimationCategory
  /** @keyframes 规则的纯 CSS 文本（不含 @keyframes 包裹层之外的任何选择器） */
  keyframes: string
  /** 是否为退场动画（to 隐藏） */
  exit?: boolean
}

/* ═══════════════════════════════════════════════════════════════
   内置动画 keyframes 文本
   ═══════════════════════════════════════════════════════════════ */
const KF = {
  fadeIn: `@keyframes mac-fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
  fadeOut: `@keyframes mac-fadeOut { from { opacity: 1; } to { opacity: 0; } }`,
  fadeInUp: `@keyframes mac-fadeInUp { from { opacity: 0; transform: translate3d(0, 100%, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`,
  fadeInDown: `@keyframes mac-fadeInDown { from { opacity: 0; transform: translate3d(0, -100%, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`,
  fadeInLeft: `@keyframes mac-fadeInLeft { from { opacity: 0; transform: translate3d(-100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`,
  fadeInRight: `@keyframes mac-fadeInRight { from { opacity: 0; transform: translate3d(100%, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`,
  zoomIn: `@keyframes mac-zoomIn { from { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } to { opacity: 1; transform: scale3d(1, 1, 1); } }`,
  zoomOut: `@keyframes mac-zoomOut { from { opacity: 1; transform: scale3d(1, 1, 1); } to { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } }`,
  scaleIn: `@keyframes mac-scaleIn { from { transform: scale(0); } to { transform: scale(1); } }`,
  rotateIn: `@keyframes mac-rotateIn { from { transform-origin: center; transform: rotate3d(0, 0, 1, -200deg); opacity: 0; } to { transform-origin: center; transform: translate3d(0, 0, 0); opacity: 1; } }`,
  flip: `@keyframes mac-flip { from { transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg); animation-timing-function: ease-out; } 40% { transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -190deg); animation-timing-function: ease-out; } 50% { transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -170deg); animation-timing-function: ease-in; } 80% { transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0); animation-timing-function: ease-in; } to { transform: perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0); animation-timing-function: ease-in; } }`,
  rotateInDownLeft: `@keyframes mac-rotateInDownLeft { from { transform-origin: left bottom; transform: rotate3d(0, 0, 1, -45deg); opacity: 0; } to { transform-origin: left bottom; transform: translate3d(0, 0, 0); opacity: 1; } }`,
  bounce: `@keyframes mac-bounce { from, 20%, 53%, 80%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); transform: translate3d(0, 0, 0); } 40%, 43% { animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06); transform: translate3d(0, -30px, 0); } 70% { animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06); transform: translate3d(0, -15px, 0); } 90% { transform: translate3d(0, -4px, 0); } }`,
  bounceIn: `@keyframes mac-bounceIn { from, 20%, 40%, 60%, 80%, to { animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); } 0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); } 20% { transform: scale3d(1.1, 1.1, 1.1); } 40% { transform: scale3d(0.9, 0.9, 0.9); } 60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); } 80% { transform: scale3d(0.97, 0.97, 0.97); } to { opacity: 1; transform: scale3d(1, 1, 1); } }`,
  slideInLeft: `@keyframes mac-slideInLeft { from { transform: translate3d(-100%, 0, 0); visibility: visible; } to { transform: translate3d(0, 0, 0); } }`,
  slideInRight: `@keyframes mac-slideInRight { from { transform: translate3d(100%, 0, 0); visibility: visible; } to { transform: translate3d(0, 0, 0); } }`,
  slideInUp: `@keyframes mac-slideInUp { from { transform: translate3d(0, 100%, 0); visibility: visible; } to { transform: translate3d(0, 0, 0); } }`,
  slideInDown: `@keyframes mac-slideInDown { from { transform: translate3d(0, -100%, 0); visibility: visible; } to { transform: translate3d(0, 0, 0); } }`,
  shake: `@keyframes mac-shake { from, to { transform: translate3d(0, 0, 0); } 10%, 30%, 50%, 70%, 90% { transform: translate3d(-10px, 0, 0); } 20%, 40%, 60%, 80% { transform: translate3d(10px, 0, 0); } }`,
  pulse: `@keyframes mac-pulse { from { transform: scale3d(1, 1, 1); } 50% { transform: scale3d(1.05, 1.05, 1.05); } to { transform: scale3d(1, 1, 1); } }`,
  flash: `@keyframes mac-flash { from, 50%, to { opacity: 1; } 25%, 75% { opacity: 0; } }`,
  swing: `@keyframes mac-swing { 20% { transform: rotate3d(0, 0, 1, 15deg); } 40% { transform: rotate3d(0, 0, 1, -10deg); } 60% { transform: rotate3d(0, 0, 1, 5deg); } 80% { transform: rotate3d(0, 0, 1, -5deg); } to { transform: rotate3d(0, 0, 1, 0); } }`,
  wobble: `@keyframes mac-wobble { from { transform: translate3d(0, 0, 0); } 15% { transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg); } 30% { transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg); } 45% { transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg); } 60% { transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg); } 75% { transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg); } to { transform: translate3d(0, 0, 0); } }`,
  jello: `@keyframes mac-jello { from, 11.1%, to { transform: translate3d(0, 0, 0); } 22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); } 33.3% { transform: skewX(6.25deg) skewY(6.25deg); } 44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); } 55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); } 66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); } 77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); } 88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); } }`,
  rubberBand: `@keyframes mac-rubberBand { from { transform: scale3d(1, 1, 1); } 30% { transform: scale3d(1.25, 0.75, 1); } 40% { transform: scale3d(0.75, 1.25, 1); } 50% { transform: scale3d(1.15, 0.85, 1); } 65% { transform: scale3d(0.95, 1.05, 1); } 75% { transform: scale3d(1.05, 0.95, 1); } to { transform: scale3d(1, 1, 1); } }`,
  tada: `@keyframes mac-tada { from { transform: scale3d(1, 1, 1); } 10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); } 30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); } 40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); } to { transform: scale3d(1, 1, 1); } }`,
  rollIn: `@keyframes mac-rollIn { from { opacity: 0; transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg); } to { opacity: 1; transform: translate3d(0, 0, 0); } }`,
  lightSpeedIn: `@keyframes mac-lightSpeedIn { from { transform: translate3d(100%, 0, 0) skewX(-30deg); opacity: 0; } 60% { transform: skewX(20deg); opacity: 1; } 80% { transform: skewX(-5deg); opacity: 1; } to { transform: translate3d(0, 0, 0); opacity: 1; } }`,
  heartBeat: `@keyframes mac-heartBeat { 0% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }`,
} as const

/* ═══════════════════════════════════════════════════════════════
   内置动画清单（27 种）
   ═══════════════════════════════════════════════════════════════ */
export const BUILT_IN: AnimationDefinition[] = [
  // 淡入淡出
  { name: 'fadeIn', description: '透明度从 0 到 1 淡入', category: 'fade', keyframes: KF.fadeIn },
  {
    name: 'fadeOut',
    description: '透明度从 1 到 0 淡出',
    category: 'fade',
    keyframes: KF.fadeOut,
    exit: true,
  },
  {
    name: 'fadeInUp',
    description: '从下方淡入并向上平移',
    category: 'fade',
    keyframes: KF.fadeInUp,
  },
  {
    name: 'fadeInDown',
    description: '从上方淡入并向下平移',
    category: 'fade',
    keyframes: KF.fadeInDown,
  },
  {
    name: 'fadeInLeft',
    description: '从左侧淡入并向右平移',
    category: 'fade',
    keyframes: KF.fadeInLeft,
  },
  {
    name: 'fadeInRight',
    description: '从右侧淡入并向左平移',
    category: 'fade',
    keyframes: KF.fadeInRight,
  },
  // 缩放
  { name: 'zoomIn', description: '从 0.3 倍缩放并淡入', category: 'scale', keyframes: KF.zoomIn },
  {
    name: 'zoomOut',
    description: '缩小到 0.3 倍并淡出',
    category: 'scale',
    keyframes: KF.zoomOut,
    exit: true,
  },
  {
    name: 'scaleIn',
    description: '从 0 缩放到 1 弹性放大',
    category: 'scale',
    keyframes: KF.scaleIn,
  },
  // 旋转 / 翻转
  {
    name: 'rotateIn',
    description: '从 -200deg 旋转淡入',
    category: 'rotate',
    keyframes: KF.rotateIn,
  },
  { name: 'flip', description: '3D Y 轴翻转', category: 'rotate', keyframes: KF.flip },
  {
    name: 'rotateInDownLeft',
    description: '以左下角为原点旋转淡入',
    category: 'rotate',
    keyframes: KF.rotateInDownLeft,
  },
  // 平移 / 滑动
  { name: 'slideInLeft', description: '从左侧滑入', category: 'slide', keyframes: KF.slideInLeft },
  {
    name: 'slideInRight',
    description: '从右侧滑入',
    category: 'slide',
    keyframes: KF.slideInRight,
  },
  { name: 'slideInUp', description: '从下方滑入', category: 'slide', keyframes: KF.slideInUp },
  { name: 'slideInDown', description: '从上方滑入', category: 'slide', keyframes: KF.slideInDown },
  // 弹跳
  { name: 'bounce', description: '垂直弹跳', category: 'bounce', keyframes: KF.bounce },
  { name: 'bounceIn', description: '弹性缩放淡入', category: 'bounce', keyframes: KF.bounceIn },
  // 特殊效果
  { name: 'shake', description: '水平抖动', category: 'special', keyframes: KF.shake },
  { name: 'pulse', description: '轻微脉冲缩放', category: 'special', keyframes: KF.pulse },
  { name: 'flash', description: '透明度闪烁', category: 'special', keyframes: KF.flash },
  { name: 'swing', description: '钟摆式摆动', category: 'special', keyframes: KF.swing },
  { name: 'wobble', description: '摇摆并旋转', category: 'special', keyframes: KF.wobble },
  { name: 'jello', description: '果冻形变', category: 'special', keyframes: KF.jello },
  { name: 'rubberBand', description: '橡皮筋拉伸', category: 'special', keyframes: KF.rubberBand },
  { name: 'tada', description: '缩放旋转强调', category: 'special', keyframes: KF.tada },
  { name: 'rollIn', description: '从左侧滚动旋转淡入', category: 'special', keyframes: KF.rollIn },
  {
    name: 'lightSpeedIn',
    description: '光速斜切淡入',
    category: 'special',
    keyframes: KF.lightSpeedIn,
  },
  { name: 'heartBeat', description: '心跳缩放', category: 'special', keyframes: KF.heartBeat },
]

/** 内置动画名称集合（用于判断是否需要动态注入 keyframes） */
export const BUILT_IN_ANIMATION_NAMES: ReadonlySet<string> = new Set(BUILT_IN.map((d) => d.name))

/* ═══════════════════════════════════════════════════════════════
   注册表（支持运行时扩展）
   ═══════════════════════════════════════════════════════════════ */
const registry = new Map<string, AnimationDefinition>()

for (const def of BUILT_IN) {
  registry.set(def.name, def)
}

/**
 * 注册自定义动画（可扩展性入口）
 *
 * @example
 * ```ts
 * registerAnimation({
 *   name: 'myFade',
 *   description: '自定义淡入',
 *   category: 'fade',
 *   keyframes: '@keyframes mac-myFade { from { opacity: 0; } to { opacity: 1; } }',
 * })
 * ```
 * 注册后即可通过 `<mac-animation type="myFade">` 使用。
 */
export function registerAnimation(def: AnimationDefinition): void {
  if (!def.name) {
    throw new Error('[mac-animation] 动画名称不能为空')
  }
  registry.set(def.name, def)
}

/**
 * 根据名称获取动画定义，未找到时返回 undefined
 */
export function getAnimation(name: string): AnimationDefinition | undefined {
  return registry.get(name)
}

/**
 * 判断动画是否已注册
 */
export function hasAnimation(name: string): boolean {
  return registry.has(name)
}

/**
 * 获取所有已注册动画名称列表
 */
export function getAnimationNames(): string[] {
  return Array.from(registry.keys())
}

/**
 * 获取所有已注册动画定义
 */
export function getAllAnimations(): AnimationDefinition[] {
  return Array.from(registry.values())
}

/* ═══════════════════════════════════════════════════════════════
   样式类模式：聚合所有 @keyframes 的 CSSResult
   ═══════════════════════════════════════════════════════════════ */
const allKeyframesText = BUILT_IN.map((d) => d.keyframes).join('\n')

/**
 * 所有内置动画的 @keyframes（供 HOC 组件注入 Shadow DOM）。
 */
export const builtInKeyframes: CSSResult = css([
  allKeyframesText,
] as unknown as TemplateStringsArray)

/**
 * 样式类模式的完整样式表：
 *   - 包含所有 @keyframes
 *   - 为每个动画生成 `.mac-anim-{name}` 类，使用合理的默认参数
 *
 * 使用方式（在任意自定义元素中 adoptedStyleSheets 或 css`` 拼接）：
 * ```ts
 * import { animationStyleSheet } from '@hy/mac-ui'
 * ```
 * 也可直接在普通 HTML 中通过 `<style>` 注入 `animationStyleSheet.cssText`。
 */
const classesText =
  allKeyframesText +
  '\n' +
  BUILT_IN.map((d) => `.mac-anim-${d.name} { animation-name: mac-${d.name}; }`).join('\n')

export const animationStyleSheet: CSSResult = css([classesText] as unknown as TemplateStringsArray)

/**
 * 动画参数接口
 */
export interface AnimationOptions {
  /** 动画时长，如 '1s' / '500ms' */
  duration?: string
  /** 延迟时间 */
  delay?: string
  /** 重复次数，数字或 'infinite' */
  iterationCount?: number | 'infinite'
  /** 方向 */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  /** 填充模式 */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  /** 缓动函数 */
  timingFunction?: string
  /** 是否暂停 */
  paused?: boolean
}

/**
 * 根据动画名称与参数生成 inline `animation` 简写字符串。
 * 用于「样式类模式」下动态控制单个元素。
 *
 * @example
 * ```ts
 * el.style.animation = buildAnimationShorthand('fadeIn', { duration: '0.5s' })
 * ```
 */
export function buildAnimationShorthand(name: string, options: AnimationOptions = {}): string {
  const def = getAnimation(name)
  if (!def) {
    return ''
  }
  const parts = [
    `mac-${def.name}`,
    options.duration ?? '1s',
    options.timingFunction ?? 'ease',
    options.delay ?? '0s',
    String(options.iterationCount ?? 1),
    options.direction ?? 'normal',
    options.fillMode ?? 'both',
    options.paused ? 'paused' : 'running',
  ]
  return parts.join(' ')
}

/**
 * 生成可直接用于 `style` 属性的对象形式（camelCase）。
 *
 * @example
 * ```ts
 * html`<div style=${styleMap(getAnimationStyleObject('bounce', { duration: '0.8s' }))}></div>`
 * ```
 */
export function getAnimationStyleObject(
  name: string,
  options: AnimationOptions = {},
): Record<string, string> {
  const def = getAnimation(name)
  if (!def) {
    return {}
  }
  return {
    animationName: `mac-${def.name}`,
    animationDuration: options.duration ?? '1s',
    animationTimingFunction: options.timingFunction ?? 'ease',
    animationDelay: options.delay ?? '0s',
    animationIterationCount: String(options.iterationCount ?? 1),
    animationDirection: options.direction ?? 'normal',
    animationFillMode: options.fillMode ?? 'both',
    animationPlayState: options.paused ? 'paused' : 'running',
  }
}
