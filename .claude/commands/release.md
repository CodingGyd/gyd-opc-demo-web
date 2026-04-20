# /release — 发版流程

> 遵循 docs/09-发版规范.md，版本号使用 SemVer

## 步骤

1. **检查工作区**：`git status` 确认无未提交更改，`git pull origin main` 拉取最新
2. **创建 feature 分支**：`git checkout -b feature/{简述功能} main`
3. **开发完成**：在 feature 分支完成代码修改
4. **测试自检**：执行 `/test-check` Skill，确保全量通过
5. **版本号修改**：更新 package.json 中的 version
   - 新增页面/组件/功能 → MINOR（1.0.0 → 1.1.0）
   - Bug修复 → PATCH（1.1.0 → 1.1.1）
   - 不兼容的 API 变更 → MAJOR（1.1.1 → 2.0.0）
6. **更新 Changelog**：按格式更新 docs/changelog.md（Added / Changed / Fixed / Deprecated / Breaking Change）
7. **提交 PR**：`git add -A` → 用文件方式提交中文 commit message → `git push -u origin feature/{简述功能}` → `gh pr create`
8. **等待人工审批合并**：提醒仓库所有者审批并手动点击 Merge（保留 feature 分支）
9. **CI 自动化**：合并后 CI 自动执行构建验证
   - 通过 → 自动打 Tag v{version} + 自动删除 feature 分支
   - 失败 → 在 feature 分支修复 → 重新提交 PR
10. **文档收尾**：检查并更新以下文档
    - docs/changelog.md（已在步骤 6 更新）
    - docs/pages.md（页面有增删改时）
    - docs/components.md（组件有增删改时）
    - docs/config.md（配置项有变化时）

## PR 合并红线
- **PR 必须由仓库所有者人工审批并手动点击 Merge，禁止自动合并**
- AI 可以提交 PR，但合并操作必须人工执行
- Merge 时保留 feature 分支，等 CI 验证通过后由 CI 自动删除
