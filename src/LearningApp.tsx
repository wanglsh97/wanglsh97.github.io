import { useEffect, useMemo, useState } from "react";
import {
  learningCategories,
  learningNotes,
  type LearningCategory,
} from "./data/learningNotes";
import "./learning.css";

type Filter = "全部" | LearningCategory;

export function LearningApp() {
  const [activeCategory, setActiveCategory] = useState<Filter>("全部");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.classList.add("learning-mode");
    return () => document.body.classList.remove("learning-mode");
  }, []);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return learningNotes.filter((note) => {
      const matchesCategory =
        activeCategory === "全部" || note.category === activeCategory;
      const haystack = [
        note.category,
        note.title,
        note.summary,
        note.takeaway,
        ...note.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const categoryCount = (category: LearningCategory) =>
    learningNotes.filter((note) => note.category === category).length;

  return (
    <div className="learning-page">
      <header className="learning-header">
        <a className="learning-wordmark" href="/">
          WLS<span>.</span>
        </a>
        <nav aria-label="学习页导航">
          <a href="/">个人主页</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">简历</a>
          <a href="https://github.com/wanglsh97" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </header>

      <main>
        <section className="learning-hero">
          <div>
            <p className="learning-eyebrow">Learning in public · 持续整理</p>
            <h1>
              AI 学习
              <br />
              手记
            </h1>
          </div>
          <div className="learning-intro">
            <p>
              把终端里踩过的坑、Agent 工程中的判断，以及暂时想不明白的问题，
              整理成下一次可以直接复用的知识。
            </p>
            <dl>
              <div>
                <dt>{learningNotes.length}</dt>
                <dd>条笔记</dd>
              </div>
              <div>
                <dt>{learningCategories.length}</dt>
                <dd>个分类</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="learning-workspace">
          <aside className="learning-sidebar">
            <div className="sidebar-heading">
              <span>分类索引</span>
              <span>INDEX</span>
            </div>
            <button
              type="button"
              className={activeCategory === "全部" ? "active" : ""}
              onClick={() => setActiveCategory("全部")}
            >
              <span>全部</span>
              <small>{learningNotes.length}</small>
            </button>
            {learningCategories.map((category) => (
              <button
                type="button"
                className={activeCategory === category ? "active" : ""}
                key={category}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <small>{categoryCount(category)}</small>
              </button>
            ))}
          </aside>

          <div className="learning-content">
            <div className="learning-toolbar">
              <label>
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索标题、结论或关键词"
                  aria-label="搜索学习笔记"
                />
              </label>
              <p>
                显示 <strong>{filteredNotes.length}</strong> / {learningNotes.length}
              </p>
            </div>

            <div className="notes-list" aria-live="polite">
              {filteredNotes.length ? (
                filteredNotes.map((note, index) => (
                  <article className="note-row" key={note.id}>
                    <div className="note-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="note-body">
                      <p className="note-category">{note.category}</p>
                      <h2>{note.title}</h2>
                      <p className="note-summary">{note.summary}</p>
                      <p className="note-takeaway">
                        <span>记住</span>
                        {note.takeaway}
                      </p>
                      <ul aria-label="关键词">
                        {note.keywords.map((keyword) => (
                          <li key={keyword}>{keyword}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))
              ) : (
                <div className="learning-empty">
                  <p>没有匹配的笔记。</p>
                  <button type="button" onClick={() => {
                    setQuery("");
                    setActiveCategory("全部");
                  }}>
                    清除筛选
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="learning-footer">
        <p>不是答案仓库，是不断修正的认知快照。</p>
        <a href="/">返回个人主页 ↑</a>
      </footer>
    </div>
  );
}
