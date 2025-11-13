## 目标
- 将代码里所有使用 `bg-gradient-to-r ... text-white` 的按钮统一替换为 `Button` 组件，采用 `variant="primary"` 浅色主按钮。
- 保留原有尺寸/圆角/宽度语义（如 `rounded-full`、`w-full`）通过 `size` 与额外类实现。

## 替换范围与映射
- `apps/web/src/app/page.tsx`
  - 108: 模拟下单 → `<Button variant="primary" size="md">模拟下单</Button>`
  - 130: 多元 A/B/C 选项 → 活跃用 `primary`，非活跃用 `subtle`，`size="sm"`
- `apps/web/src/components/ChatPanel.tsx`
  - 206: 发送按钮 → `<Button variant="primary" size="sm" disabled={sending}>发送</Button>`（保留 disabled 样式）
- `apps/web/src/components/ForumSection.tsx`
  - 204: 评论提交按钮 → `<Button variant="primary" size="sm">评论</Button>`
- `apps/web/src/app/trending/page.tsx`
  - 1571、1677、1692、1707、2223、2227、2389、2583、2677 等：统一为 `<Button variant="primary" size="md">`；需要 `w-full` 的保留 `fullWidth` 或加 `className="w-full"`
  - 2058、2102、2106：被选中状态的分类按钮改用 `Button`（选中 `primary`，未选中 `subtle`），保留圆角与边框效果
- `apps/web/src/app/prediction/[id]/page.tsx`
  - 516 等仅为面板/进度条渐变，不是按钮；按钮若存在渐变同样替换为 `Button`。
- `apps/web/src/app/my-follows/page.tsx`
  - 418：统一为 `<Button variant="primary" size="sm">`

## 尺寸与风格规则
- 尺寸：列表内小按钮用 `size="sm"`；主要操作用 `size="md"`；Hero/CTA 可用 `size="lg"`。
- 宽度：保留 `w-full`；若需要圆角更大，透传 `className="rounded-2xl"`。
- 状态：活跃用 `primary`；次级用 `subtle`；危险/否定保持 `danger`（如点踩）。

## 技术要点
- 统一改为 `<Button>` 组件；对 Link 包裹的按钮使用 `<Link><Button .../></Link>`。
- 保留无障碍属性与焦点环；disabled 透传即可。

## 交付与验证
- 扫描/替换上述行，运行本地预览，确认视觉统一与交互正常。
- 专注按钮，不改进度条或纯视觉背景渐变；仅将“按钮颜色”改为你偏好的浅色主按钮。

确认后我将执行以上替换并更新预览。