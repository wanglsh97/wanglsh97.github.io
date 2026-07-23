import { marked } from "marked";
import learningMarkdown from "./content/learning.md?raw";
import "./App.css";

const learningHtml = marked.parse(learningMarkdown, { async: false });

export default function App() {
  return (
    <div className="site">
      <header>
        <a className="name" href="/">
          wangliangsheng
        </a>
        <nav aria-label="主导航">
          <a href="#about">关于</a>
          <a href="#learning">学习记录</a>
          <a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main>
        <section className="about" id="about">
          <p className="role">前端 / AI Agent 工程师</p>
          <h1>你好，我是 wangliangsheng。</h1>
          <p className="intro">
            我主要做前端应用和 AI Agent 系统，关注生成式 UI、上下文工程、
            工具调用、RAG 与多 Agent 协作。喜欢把复杂的技术做成清晰、可靠的产品体验。
          </p>
          <div className="links">
            <a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href="https://x.com/wang_ls97" target="_blank" rel="noreferrer">
              X / Twitter ↗
            </a>
          </div>
        </section>

        <section className="learning" id="learning">
          <article
            className="markdown"
            dangerouslySetInnerHTML={{ __html: learningHtml }}
          />
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} wangliangsheng</span>
        <a href="#about">回到顶部</a>
      </footer>
    </div>
  );
}
