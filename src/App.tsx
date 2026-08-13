import { useEffect, useState } from "react";
import { marked } from "marked";
import learningMarkdown from "./content/learning.md?raw";
import "./App.css";

const learningHtml = marked.parse(learningMarkdown, { async: false });

const projects = [
  { no: "01", name: "agent-orchestrator", status: "构建中", title: "多 Agent 任务编排器", desc: "围绕任务分解、工具路由与状态回放构建的协作实验，让复杂任务中的每一步都可观测、可恢复。", tags: ["TypeScript", "Agent", "Tool Use"] },
  { no: "02", name: "context-studio", status: "实验", title: "上下文工程工作台", desc: "组织系统提示、检索结果与工具 Schema，在有限窗口里建立清晰、稳定且可调试的上下文。", tags: ["Context", "Prompt", "React"] },
  { no: "03", name: "rag-notes", status: "使用中", title: "个人知识库 RAG", desc: "把 Markdown 学习笔记接入增量索引、混合检索与引用溯源，让答案始终可以回到原文。", tags: ["RAG", "Retrieval", "Markdown"] },
];

const capabilities = [
  ["前端工程", "React 19 · TypeScript", "设计系统 · 可访问性", "性能与可靠性"],
  ["AI Agent", "工具调用 · Function Calling", "上下文工程", "任务规划 · 状态管理"],
  ["检索增强", "混合检索", "引用溯源", "增量索引"],
  ["多 Agent", "任务分解", "状态共享", "校验 · 合并 · 收敛"],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height > 0 ? (scrollY / height) * 100 : 0);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site">
      <div className="progress" style={{ width: `${progress}%` }} />
      <header className="nav">
        <a className="brand" href="#top"><span>wl</span><b>~/wanglsh</b></a>
        <nav className={menuOpen ? "navlinks open" : "navlinks"} aria-label="主导航">
          <a href="#work" onClick={() => setMenuOpen(false)}>作品</a><a href="#stack" onClick={() => setMenuOpen(false)}>能力</a><a href="#learning" onClick={() => setMenuOpen(false)}>笔记</a><a href="#about" onClick={() => setMenuOpen(false)}>关于</a>
        </nav>
        <a className="nav-github" href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">GitHub ↗</a>
        <button className="menu" aria-label="切换菜单" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="gridfx" />
          <div className="hero-copy">
            <p className="eyebrow">01 / FRONTEND × AI AGENT ENGINEER</p>
            <h1>把复杂系统，<br />做成<span>清晰的体验</span><em>_</em></h1>
            <p className="lead">你好，我是 wangliangsheng。专注前端应用与 AI Agent 系统，探索生成式 UI、上下文工程、工具调用、RAG 与多 Agent 协作。</p>
            <div className="availability"><i /> AVAILABLE FOR IDEAS & COLLABORATION</div>
            <div className="actions"><a className="primary" href="#work">查看精选项目 <span>↓</span></a><a className="secondary" href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">浏览 GitHub ↗</a></div>
          </div>
          <div className="terminal" aria-label="Agent 运行轨迹示例">
            <div className="terminal-head"><span /><span /><span /><b>agent.trace</b></div>
            <div className="terminal-body">
              <p><b>$</b> initialize --mode=collaborative</p>
              <p className="dim">[context] loading workspace...</p>
              <p><strong>✓</strong> frontend.runtime <i>ready</i></p>
              <p><strong>✓</strong> retrieval.index <i>synced</i></p>
              <p><strong>✓</strong> tools.registry <i>connected</i></p>
              <div className="trace"><span>PLAN</span><i /><span>ACT</span><i /><span>VERIFY</span></div>
              <p><b>$</b> ship --with=clarity <em>█</em></p>
            </div>
          </div>
        </section>

        <section className="projects section-pad" id="work">
          <div className="section-title"><p>// 02 · SELECTED WORK</p><h2>工程实验与作品</h2><span>用小型、可运行的系统验证想法。项目仍在持续迭代，过程与结论同样重要。</span></div>
          <div className="project-grid">{projects.map((p) => <article className="project" key={p.no}>
            <div className="project-viz"><span>{p.no}</span><div className="nodes"><i /><i /><i /><i /></div><code>{p.name}.pipeline</code></div>
            <div className="project-copy"><div className="project-meta"><code>{p.name}</code><small>{p.status}</small></div><h3>{p.title}</h3><p>{p.desc}</p><ul>{p.tags.map(t => <li key={t}>{t}</li>)}</ul><a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">查看项目 <span>→</span></a></div>
          </article>)}</div>
        </section>

        <section className="skills section-pad" id="stack">
          <div className="section-title"><p>// 03 · CAPABILITY</p><h2>技术栈与能力矩阵</h2><span>框架会更替，长期投入的是解决问题的方法与工程判断。</span></div>
          <div className="matrix">{capabilities.map((c, i) => <article key={c[0]}><header><code>0{i + 1}</code><h3>{c[0]}</h3></header>{c.slice(1).map(x => <p key={x}>↳ {x}</p>)}</article>)}</div>
        </section>

        <section className="notes section-pad" id="learning">
          <div className="section-title"><p>// 04 · LEARNING LOG</p><h2>学习记录</h2><span>读书、实验与踩坑，最终都沉淀成可以继续检索和思考的文字。</span></div>
          <article className="markdown" dangerouslySetInnerHTML={{ __html: learningHtml }} />
        </section>

        <section className="about section-pad" id="about">
          <div><p className="eyebrow">// 05 · ABOUT</p><h2>技术服务于体验，<br />炫技服务于理解。</h2><p>我喜欢把模糊的问题拆成可验证的小闭环，用清晰的接口、可观测的过程和克制的交互，把复杂度留在系统内部。</p><div className="principles"><span>01 小步迭代</span><span>02 可观测优先</span><span>03 文档即代码</span></div></div>
          <aside><p>LET'S BUILD SOMETHING</p><h3>有好玩的工程问题？<br />欢迎来聊。</h3><a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer"><small>GITHUB</small><b>github.com/wanglsh97</b><span>↗</span></a><a href="https://x.com/wang_ls97" target="_blank" rel="noreferrer"><small>X / TWITTER</small><b>@wang_ls97</b><span>↗</span></a><code>:: async communication · docs first</code></aside>
        </section>
      </main>
      <footer><a className="brand" href="#top"><span>wl</span><b>~/wanglsh</b></a><p>© {new Date().getFullYear()} wangliangsheng · BUILT WITH CURIOSITY</p><a href="#top">↑ TOP</a></footer>
    </div>
  );
}
