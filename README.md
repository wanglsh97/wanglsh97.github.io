# wanglsh97.github.io

wangliangsheng 的个人网站，以一本摊开的书作为主页：工作不是人生的全部，代码之外还有生活、家庭、家乡与思考。

在线访问：[https://wanglsh97.github.io/](https://wanglsh97.github.io/)

## 页面结构

- `index.html`：书本式主页与目录，包含合书跳转动画
- `public/chapters/about.html`：关于我
- `public/chapters/articles.html`：我的文章
- `public/chapters/family.html`：我的家庭
- `public/chapters/hometown.html`：我的家乡

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

网站使用 `main` 分支作为唯一开发与发布来源：

1. 提交网站文件并推送到 `main`。
2. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 自动运行构建。
3. 工作流将 `dist/` 作为 GitHub Pages 产物发布。

章节页面保存在 `public/chapters/`，Vite 构建时会将它们复制到 `dist/chapters/`。
