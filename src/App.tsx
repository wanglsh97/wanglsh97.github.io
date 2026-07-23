import { QuietRunGame } from "./components/QuietRunGame";
import "./App.css";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Agent Workflow",
  "RAG",
  "Tool Calling",
];

export default function App() {
  return (
    <div className="page">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="回到首页">
          WLS<span>.</span>
        </a>
        <nav aria-label="主导航">
          <a href="#profile">关于</a>
          <a href="#practice">方向</a>
          <a href="/#/ai-learning">AI 学习</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            简历
          </a>
        </nav>
        <a
          className="header-status"
          href="https://github.com/wanglsh97"
          target="_blank"
          rel="noreferrer"
        >
          <i aria-hidden="true" />
          GitHub
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">前端 / AI Agent 工程师</p>
            <h1>
              把复杂系统，
              <br />
              做成清晰体验。
            </h1>
            <p className="hero-intro">
              我关注界面与智能系统的交界：从可感知的交互，到可靠的 Agent
              工作流。先玩一局，或者直接认识我。
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="/resume.pdf" target="_blank" rel="noreferrer">
                查看简历
                <span aria-hidden="true">↗</span>
              </a>
              <a className="text-action" href="#profile">
                继续浏览
              </a>
            </div>
            <div className="hero-note">
              <span aria-hidden="true">⌁</span>
              <p>写代码，也设计人如何与代码相遇。</p>
            </div>
          </div>

          <QuietRunGame />
        </section>

        <section className="profile-section" id="profile">
          <div className="section-label">
            <span>个人简介</span>
            <span>前端 × 智能系统</span>
          </div>
          <div className="profile-grid">
            <h2>
              前端是表达，
              <br />
              Agent 是协作。
            </h2>
            <div className="profile-copy">
              <p>
                我是 wangliangsheng，一名前端与 AI Agent
                工程师。擅长把模糊需求拆成可维护的界面、工具与工作流，让复杂能力以自然、清晰的方式抵达用户。
              </p>
              <p>
                目前关注生成式 UI、上下文工程、工具调用、RAG
                与多 Agent 协作，也持续打磨 TypeScript、React 和 Node.js 工程实践。
              </p>
            </div>
          </div>
        </section>

        <section className="practice-section" id="practice">
          <div className="section-label">
            <span>工作方向</span>
            <span>我能带来的价值</span>
          </div>
          <div className="practice-list">
            <article>
              <span className="practice-mark">A</span>
              <div>
                <h3>产品级前端</h3>
                <p>从信息结构到交互细节，构建稳定、可访问、响应式的 Web 体验。</p>
              </div>
              <span className="practice-arrow" aria-hidden="true">↗</span>
            </article>
            <article>
              <span className="practice-mark">B</span>
              <div>
                <h3>Agent 工程</h3>
                <p>设计上下文、工具调用与任务编排，让模型从演示走向可控的工作流。</p>
              </div>
              <span className="practice-arrow" aria-hidden="true">↗</span>
            </article>
            <article>
              <span className="practice-mark">C</span>
              <div>
                <h3>界面 × 智能</h3>
                <p>把不确定的模型能力翻译成用户看得懂、信得过、用得顺的交互。</p>
              </div>
              <span className="practice-arrow" aria-hidden="true">↗</span>
            </article>
          </div>
        </section>

        <section className="toolkit-section">
          <div className="section-label">
            <span>常用工具</span>
            <span>持续更新</span>
          </div>
          <ul>
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>

        <section className="resume-section" id="resume">
          <div>
            <p className="eyebrow">下一步</p>
            <h2>用一页简历，快速了解我。</h2>
          </div>
          <div className="resume-actions">
            <a className="primary-action light" href="/resume.pdf" target="_blank" rel="noreferrer">
              打开简历
              <span aria-hidden="true">↗</span>
            </a>
            <a className="download-action" href="/resume.pdf" download="wangliangsheng-resume.pdf">
              下载 PDF · 1 页
            </a>
          </div>
        </section>
      </main>

      <footer>
        <p>wangliangsheng © {new Date().getFullYear()}</p>
        <div>
          <a href="/#/ai-learning">AI 学习</a>
          <a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://x.com/wang_ls97" target="_blank" rel="noreferrer">X / Twitter</a>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </footer>
    </div>
  );
}
