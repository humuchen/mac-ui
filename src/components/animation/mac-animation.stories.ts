import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import './mac-animation'
import type { MacAnimation } from './mac-animation'
import {
  getAllAnimations,
  animationStyleSheet,
  buildAnimationShorthand,
  registerAnimation,
  type AnimationCategory,
} from './animations'

// 将动画 keyframes 注入到 storybook 文档作用域，使「样式类模式」可用
const sheetStyle = html`<style>
  ${unsafeHTML(animationStyleSheet.cssText)}
</style>`

const CATEGORY_LABEL: Record<AnimationCategory, string> = {
  fade: '淡入淡出',
  scale: '缩放',
  rotate: '旋转 / 翻转',
  slide: '滑动',
  bounce: '弹跳',
  special: '特殊效果',
}

const animations = getAllAnimations()
const categories = Array.from(new Set(animations.map((a) => a.category)))

const meta: Meta = {
  title: 'Components/Animation',
  component: 'mac-animation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
动画组件库，内置 27 种动画效果，支持两种使用方式：

**1. 高阶组件模式** —— 用 \`<mac-animation>\` 包裹目标内容：
\`\`\`html
<mac-animation type="bounceIn" duration="0.8s">
  <div>被动画包裹的内容</div>
</mac-animation>
\`\`\`

**2. 样式类模式** —— 直接使用 \`.mac-anim-{name}\` 类，或通过 \`buildAnimationShorthand()\` 生成 inline 样式：
\`\`\`ts
import { animationStyleSheet, buildAnimationShorthand } from '@hy/mac-ui'
// 将 animationStyleSheet 注入到你的样式作用域后：
// <div class="mac-anim-bounceIn" style="animation-duration: 0.8s"></div>
// 或动态生成：
el.style.animation = buildAnimationShorthand('bounceIn', { duration: '0.8s', iterationCount: 3 })
\`\`\`

支持完整参数自定义（duration / delay / iterationCount / direction / fillMode / timingFunction）、
暂停继续控制（\`paused\` 属性或 \`pause()\`/\`resume()\`/\`restart()\`/\`stop()\` 方法）、
生命周期回调（\`mac-animation-start\` / \`mac-animation-end\` / \`mac-animation-iteration\`），
以及通过 \`registerAnimation()\` 扩展自定义动画。
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: animations.map((a) => a.name),
      description: '动画类型名称',
      table: { defaultValue: { summary: 'fadeIn' } },
    },
    duration: {
      control: 'text',
      description: '动画时长，如 1s / 500ms',
      table: { defaultValue: { summary: '1s' } },
    },
    delay: {
      control: 'text',
      description: '延迟时间',
      table: { defaultValue: { summary: '0s' } },
    },
    iterationCount: {
      control: 'object',
      description: '重复次数：数字或 infinite',
      table: { defaultValue: { summary: '1' } },
    },
    direction: {
      control: 'select',
      options: ['normal', 'reverse', 'alternate', 'alternate-reverse'],
      table: { defaultValue: { summary: 'normal' } },
    },
    fillMode: {
      control: 'select',
      options: ['none', 'forwards', 'backwards', 'both'],
      table: { defaultValue: { summary: 'both' } },
    },
    timingFunction: {
      control: 'text',
      description: '缓动函数',
      table: { defaultValue: { summary: 'ease' } },
    },
    paused: {
      control: 'boolean',
      description: '是否暂停',
      table: { defaultValue: { summary: 'false' } },
    },
    block: {
      control: 'boolean',
      description: '以块级元素渲染',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    type: 'bounceIn',
    duration: '1s',
    delay: '0s',
    iterationCount: 1,
    direction: 'normal',
    fillMode: 'both',
    timingFunction: 'ease',
    paused: false,
    block: false,
  },
}

export default meta
type Story = StoryObj

/* ═══════════════════════════════════════════════════════════════
   一个可交互的动画播放卡片
   ═══════════════════════════════════════════════════════════════ */
const animCard = (name: string, description: string) => html`
  <button
    class="anim-card"
    @click=${(e: Event) => {
      const host = (e.currentTarget as HTMLElement).querySelector('mac-animation')!
      host.restart()
    }}
    title=${description}
  >
    <mac-animation type=${name} duration="0.9s">
      <div class="anim-demo">Aa</div>
    </mac-animation>
    <div class="anim-name">${name}</div>
    <div class="anim-desc">${description}</div>
  </button>
`

const galleryStyle = html`<style>
  ${unsafeHTML(`
    .anim-gallery { display: flex; flex-direction: column; gap: 28px; }
    .anim-cat-title { font: 600 13px/1 ui-monospace, 'SF Mono', Menlo, monospace; color: #6b7280; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 10px; }
    .anim-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
    .anim-card { all: unset; cursor: pointer; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 12px 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; background: #fff; transition: border-color .2s, box-shadow .2s, transform .2s; }
    .anim-card:hover { border-color: #3b82f6; box-shadow: 0 6px 20px -8px rgba(59,130,246,.45); transform: translateY(-2px); }
    .anim-demo { width: 54px; height: 54px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font: 700 20px/54px -apple-system, sans-serif; text-align: center; box-shadow: 0 4px 12px -2px rgba(59,130,246,.5); }
    .anim-name { font: 600 13px/1.2 -apple-system, sans-serif; color: #1f2937; }
    .anim-desc { font: 400 11px/1.4 -apple-system, sans-serif; color: #9ca3af; text-align: center; min-height: 30px; }
  `)}
</style>`

export const AllAnimations: Story = {
  name: '全部动画 / All Animations',
  render: () => html`
    ${galleryStyle}
    <div class="anim-gallery">
      ${categories.map(
        (cat) => html`
          <div>
            <div class="anim-cat-title">${CATEGORY_LABEL[cat]}</div>
            <div class="anim-grid">
              ${animations
                .filter((a) => a.category === cat)
                .map((a) => animCard(a.name, a.description))}
            </div>
          </div>
        `,
      )}
    </div>
    <p style="font: 400 12px -apple-system,sans-serif;color:#9ca3af;margin-top:18px">
      点击任意卡片可重新播放该动画。
    </p>
  `,
}

export const HOCMode: Story = {
  name: '高阶组件模式 / HOC Mode',
  render: (args) => {
    const getDemo = () => document.getElementById('hoc-demo') as MacAnimation | null
    const writeLog = (msg: string) => {
      const log = document.getElementById('hoc-log')
      if (log) log.textContent = msg
    }
    const onLifeCycle = (ev: string) =>
      writeLog(`事件触发：${ev} @ ${new Date().toLocaleTimeString()}`)
    return html`
      ${sheetStyle}
      <style>
        ${unsafeHTML(`
          .hoc-stage { display: flex; flex-direction: column; align-items: center; gap: 28px; padding: 40px; background: linear-gradient(135deg, #f0f9ff, #f5f3ff); border-radius: 16px; }
          .hoc-box { width: 140px; height: 140px; border-radius: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color:#fff; display:flex; align-items:center; justify-content:center; font: 800 28px -apple-system,sans-serif; box-shadow: 0 12px 32px -8px rgba(99,102,241,.55); }
          .hoc-actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
          .hoc-actions button { padding: 8px 16px; border-radius: 8px; border: 1px solid #d1d5db; background:#fff; cursor:pointer; font: 500 13px -apple-system,sans-serif; transition: all .2s; }
          .hoc-actions button:hover { border-color:#3b82f6; color:#3b82f6; }
          .hoc-log { font: 400 12px ui-monospace, Menlo, monospace; color:#6b7280; min-height:18px; }
        `)}
      </style>
      <div class="hoc-stage">
        <mac-animation
          id="hoc-demo"
          type=${args.type}
          duration=${args.duration}
          delay=${args.delay}
          iterationCount=${args.iterationCount}
          direction=${args.direction}
          fillMode=${args.fillMode}
          timingFunction=${args.timingFunction}
          ?paused=${args.paused}
          ?block=${args.block}
          @mac-animation-start=${() => onLifeCycle('mac-animation-start')}
          @mac-animation-iteration=${() => onLifeCycle('mac-animation-iteration')}
          @mac-animation-end=${() => onLifeCycle('mac-animation-end')}
        >
          <div class="hoc-box">Mac</div>
        </mac-animation>
        <div class="hoc-actions">
          <button @click=${() => getDemo()?.restart()}>重新播放</button>
          <button @click=${() => getDemo()?.pause()}>暂停</button>
          <button @click=${() => getDemo()?.resume()}>继续</button>
          <button @click=${() => getDemo()?.stop()}>停止</button>
        </div>
        <div class="hoc-log" id="hoc-log">
          就绪 —— 在 Controls 中调整参数，或点击上方按钮控制动画。
        </div>
      </div>
    `
  },
}

export const StyleClassMode: Story = {
  name: '样式类模式 / Style Class Mode',
  render: () => html`
    ${sheetStyle}
    <style>
      ${unsafeHTML(`
        .sc-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap:16px; }
        .sc-item { display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 12px; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
        .sc-box { width:60px; height:60px; border-radius:14px; background:linear-gradient(135deg,#f59e0b,#ef4444); box-shadow:0 6px 16px -4px rgba(239,68,68,.5); }
        .sc-box.b { background:linear-gradient(135deg,#10b981,#3b82f6); }
        .sc-label { font: 600 12px -apple-system,sans-serif; color:#374151; }
        .sc-note { font:400 12px -apple-system,sans-serif; color:#9ca3af; margin-top:18px; }
        code { background:#f3f4f6; padding:2px 6px; border-radius:4px; font:500 12px ui-monospace,Menlo,monospace; color:#3b82f6; }
      `)}
    </style>
    <h3 style="font:600 15px -apple-system,sans-serif;margin:0 0 12px">
      方式一：使用 <code>.mac-anim-&#123;name&#125;</code> 类
    </h3>
    <div class="sc-grid">
      <div class="sc-item">
        <div
          class="sc-box mac-anim-pulse"
          style="animation-duration:1.2s; animation-iteration-count:infinite"
        ></div>
        <div class="sc-label">mac-anim-pulse</div>
      </div>
      <div class="sc-item">
        <div
          class="sc-box b mac-anim-heartBeat"
          style="animation-duration:1.5s; animation-iteration-count:infinite"
        ></div>
        <div class="sc-label">mac-anim-heartBeat</div>
      </div>
      <div class="sc-item">
        <div
          class="sc-box mac-anim-flash"
          style="animation-duration:1s; animation-iteration-count:infinite"
        ></div>
        <div class="sc-label">mac-anim-flash</div>
      </div>
    </div>
    <h3 style="font:600 15px -apple-system,sans-serif;margin:24px 0 12px">
      方式二：使用 <code>buildAnimationShorthand()</code> 动态生成
    </h3>
    <div class="sc-grid">
      <div class="sc-item">
        <div
          class="sc-box b"
          style=${`animation: ${buildAnimationShorthand('jello', { duration: '0.9s', iterationCount: 'infinite' })}`}
        ></div>
        <div class="sc-label">jello · infinite</div>
      </div>
      <div class="sc-item">
        <div
          class="sc-box"
          style=${`animation: ${buildAnimationShorthand('swing', { duration: '1s', iterationCount: 'infinite', direction: 'alternate' })}`}
        ></div>
        <div class="sc-label">swing · alternate</div>
      </div>
      <div class="sc-item">
        <div
          class="sc-box b"
          style=${`animation: ${buildAnimationShorthand('rubberBand', { duration: '1.2s', iterationCount: 'infinite' })}`}
        ></div>
        <div class="sc-label">rubberBand · infinite</div>
      </div>
    </div>
    <p class="sc-note">
      样式类模式需先将 <code>animationStyleSheet</code> 注入到样式作用域（本页已注入）。
      每个动画对应的类名格式为 <code>mac-anim-&#123;动画名&#125;</code>。
    </p>
  `,
}

export const CustomAnimation: Story = {
  name: '扩展自定义动画 / Custom',
  render: () => {
    // 注册一个自定义动画（幂等：已注册则覆盖）
    if (!getAllAnimations().some((a) => a.name === 'myGlow')) {
      registerAnimation({
        name: 'myGlow',
        description: '自定义发光缩放',
        category: 'special',
        keyframes:
          '@keyframes mac-myGlow { 0% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59,130,246,0)); } 50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(59,130,246,.8)); } 100% { transform: scale(1); filter: drop-shadow(0 0 0 rgba(59,130,246,0)); } }',
      })
    }
    return html`
      <style>
        ${unsafeHTML(`
          .cust-stage { padding: 40px; background: #0f172a; border-radius: 16px; display:flex; flex-direction:column; align-items:center; gap:18px; }
          .cust-box { width: 120px; height: 120px; border-radius: 24px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 0 0 rgba(59,130,246,0); }
          .cust-code { font: 400 12px/1.7 ui-monospace, Menlo, monospace; color:#94a3b8; background:#1e293b; padding:14px 16px; border-radius:8px; max-width: 560px; }
          .cust-code b { color:#60a5fa; }
        `)}
      </style>
      <div class="cust-stage">
        <mac-animation type="myGlow" duration="2s" iterationCount="infinite">
          <div class="cust-box"></div>
        </mac-animation>
        <pre class="cust-code">
import { registerAnimation } from '@hy/mac-ui'

registerAnimation({
  name: <b>'myGlow'</b>,
  description: '自定义发光缩放',
  category: 'special',
  keyframes: '@keyframes mac-myGlow { ... }',
})

// 注册后即可使用
&lt;mac-animation type=<b>"myGlow"</b>&gt;...&lt;/mac-animation&gt;</pre
        >
      </div>
    `
  },
}
