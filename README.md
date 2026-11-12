# Mote Mac 内测发布

本目录为面向 Apple 芯片 Mac 的公开下载页和发布材料。

## 首次发布

1. 确认 ../mote/src/beta-config.json 中的仓库及反馈邮箱。
2. 完成本地验证与 Mac 构建。
3. 执行 node ../mote/scripts/prepare-beta.cjs /tmp/mote-1300-release。
4. 账号本人运行 gh auth login --hostname github.com --web 完成登录。
5. 阅读生成的 docs 和 release-notes.md 后，在当前目录运行 node publish.cjs --publish。

发布脚本建立公开的 George-Qiaomu/mote-releases 仓库，通过白名单推送下载页和发布说明，
把 ZIP 和校验文件上传到 GitHub Releases。GitHub Pages 指向 main 分支的 /docs 目录。
程序源码保留在 Mote 开发目录。

## 以后发布

提高 Mote 版本号，完整验证、打包后重新执行 prepare-beta，更新 release-notes.md，再运行 publish。
ZIP 文件名为 Mote-版本-mac-arm64.zip。应用只提示有对应安装包的正式 release。
GitHub prerelease 标记会使版本不参与当前通道的新版检查。

应用每六小时及启动后检查新版。提醒提供查看下载和稍后。
朋友退出旧版后手动替换应用。任务和记录保存在用户资料目录。
首次运行和升级可能需要确认 macOS 辅助功能权限。
朋友在应用内填写反馈并发送，FormSubmit 转发给开发者的 qiaomu@uni.minerva.edu 邮箱。
下载页也可直接提交反馈。首次启用由开发者点击 FormSubmit 激活邮件。
首次公开发布前，需要通过真实发送测试并确认邮箱收到反馈。
