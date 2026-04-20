# /hotfix — 紧急修复流程

> 遵循 docs/09-发版规范.md 紧急修复章节

## 步骤

1. **检查当前分支**：确认在 main 上，`git pull origin main` 拉取最新
2. **创建 hotfix 分支**：`git checkout -b hotfix/v{version} main`（version 为 PATCH+1 后的版本号）
3. **定位问题**：阅读报错日志 / issue 描述，定位到具体代码文件
4. **修复代码**：最小化修改，只修复问题本身，不做重构
5. **测试自检**：执行 `/test-check` Skill，确认修复有效
6. **版本号修改**：将 package.json 版本号 PATCH+1（如 1.0.0 → 1.0.1）
7. **更新 Changelog**：在 docs/changelog.md 的 Fixed 段添加修复说明
8. **提交 PR**：`git add {具体文件}` → 用文件方式提交中文 commit message → `git push -u origin hotfix/v{version}` → `gh pr create`
9. **等待人工审批合并**：提醒仓库所有者尽快审批并手动点击 Merge
10. **CI 自动化**：合并后 CI 自动验证
    - 通过 → 自动打 Tag v{version} + 自动删除 hotfix 分支
    - 失败 → 在 hotfix 分支修复 → 重新提交 PR
11. **文档收尾**：更新 docs/changelog.md

## 注意
- hotfix 只做最小化修复，不夹带其他改动
- AI 不可自动合并 PR
