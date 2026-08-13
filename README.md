# wanglsh97.github.io

wangliangsheng 的个人网站，以一本摊开的书作为主页：工作不是人生的全部，代码之外还有生活、家庭、家乡与思考。

在线访问：[https://wanglsh97.github.io/](https://wanglsh97.github.io/)

## 页面结构

- `index.html`：书本式主页与目录，包含合书跳转动画
- `chapters/about.html`：关于我
- `chapters/articles.html`：我的文章
- `chapters/family.html`：我的家庭
- `chapters/hometown.html`：我的家乡

## 开发

```bash
npm install
npm run dev
```

开发服务器默认运行于 [http://localhost:5173/](http://localhost:5173/)。

生产构建检查：

```bash
npm run build
```

## 部署

GitHub Pages 直接使用 `main` 分支根目录：

当前线上发布源：`main / (root)`。

1. 提交网站文件并推送到 `main`。
2. 在仓库 **Settings → Pages** 中选择 **Deploy from a branch**。
3. Source 设置为 `main` 分支和 `/ (root)` 目录。

由于 Pages 直接发布仓库根目录，章节页面保存在 `chapters/`，不要移动到 `public/`。
