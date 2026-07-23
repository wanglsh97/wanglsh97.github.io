import { PolarityGame } from "./components/PolarityGame";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <PolarityGame />
      <section className="about" id="about">
        <p className="about-kicker">wangliangsheng</p>
        <h2>Frontend Engineer · Agent Engineer</h2>
        <p className="about-copy">
          正在做前端应用与 AI Agent 系统。关注生成式 UI、上下文工程、工具调用、RAG
          与多 Agent 协作，喜欢把可靠的工作流做成清晰的人机交互。
        </p>
        <ul className="stack">
          <li>TypeScript</li>
          <li>React</li>
          <li>Next.js</li>
          <li>Node.js</li>
          <li>Python</li>
        </ul>
        <div className="links">
          <a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://x.com/wang_ls97" target="_blank" rel="noreferrer">
            X / Twitter
          </a>
        </div>
      </section>
    </div>
  );
}
