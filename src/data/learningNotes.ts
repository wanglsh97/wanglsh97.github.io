export const learningCategories = [
  "terminal",
  "cli",
  "desktop",
  "openclaw",
  "tool",
  "sandbox",
  "coding agents",
  "Digital agents",
] as const;

export type LearningCategory = (typeof learningCategories)[number];

export type LearningNote = {
  id: string;
  category: LearningCategory;
  title: string;
  summary: string;
  takeaway: string;
  keywords: string[];
};

export const learningNotes: LearningNote[] = [
  {
    id: "terminal-process-signals",
    category: "terminal",
    title: "终端里的进程、会话与信号",
    summary:
      "启动一个命令，不只是运行一个程序。前台进程组、控制终端与信号传播，共同决定 Ctrl+C、挂起和退出时会发生什么。",
    takeaway: "排查“命令停不下来”时，先画清父子进程与信号路径。",
    keywords: ["process", "signal", "stdin", "foreground"],
  },
  {
    id: "terminal-shell-modes",
    category: "terminal",
    title: "登录 Shell 与交互 Shell 不是一回事",
    summary:
      "不同启动方式会读取不同配置文件。环境变量在终端里存在、在脚本或桌面应用里消失，往往源于启动链不同。",
    takeaway: "不要把所有初始化都塞进同一个 rc 文件。",
    keywords: ["shell", "zsh", "profile", "environment"],
  },
  {
    id: "cli-output-contract",
    category: "cli",
    title: "stdout、stderr 与退出码是一组接口",
    summary:
      "CLI 的输出不仅给人看，也会被管道、脚本和 Agent 消费。稳定的机器输出、明确的错误流与退出码比彩色日志更重要。",
    takeaway: "面向自动化设计 CLI 时，把输出当成 API。",
    keywords: ["stdout", "stderr", "exit code", "pipe"],
  },
  {
    id: "cli-dry-run",
    category: "cli",
    title: "破坏性命令应该先提供预演",
    summary:
      "好的 dry-run 会展示精确目标、将发生的变化和跳过原因，让用户在真正执行前验证范围。",
    takeaway: "预演结果必须和真实执行共享同一套解析逻辑。",
    keywords: ["dry-run", "safety", "preview", "idempotency"],
  },
  {
    id: "desktop-boundaries",
    category: "desktop",
    title: "桌面应用先划清进程边界",
    summary:
      "窗口、系统能力与 Web UI 处于不同信任域。把文件系统或系统命令直接暴露给渲染层，会让便利变成权限漏洞。",
    takeaway: "通过窄而明确的消息接口暴露系统能力。",
    keywords: ["ipc", "renderer", "main process", "permissions"],
  },
  {
    id: "desktop-deep-link",
    category: "desktop",
    title: "深链接也是应用协议",
    summary:
      "一个可用的深链接需要处理冷启动、已有窗口、参数校验和版本兼容，而不只是注册一个 URL scheme。",
    takeaway: "把深链接路由当成外部输入，先校验再执行。",
    keywords: ["deep link", "protocol", "routing", "validation"],
  },
  {
    id: "openclaw-versioned-notes",
    category: "openclaw",
    title: "关于 OpenClaw 的结论要绑定版本",
    summary:
      "运行入口、配置层次与扩展点都可能随版本变化。记录实验时，应同时保存版本、环境和最小复现步骤。",
    takeaway: "没有版本与复现条件的结论，很快就会变成噪声。",
    keywords: ["openclaw", "version", "configuration", "reproduction"],
  },
  {
    id: "openclaw-boundary-map",
    category: "openclaw",
    title: "先画能力边界，再研究实现细节",
    summary:
      "从输入、状态、工具、权限与输出五个方向梳理系统，比从单个配置项开始更容易形成完整心智模型。",
    takeaway: "学习新 Agent 系统时，先建立边界地图。",
    keywords: ["openclaw", "capability", "state", "architecture"],
  },
  {
    id: "tool-description",
    category: "tool",
    title: "工具描述会直接改变模型行为",
    summary:
      "名称、描述、参数与错误信息共同构成模型看到的产品界面。含糊的工具定义会把确定性问题变成提示词问题。",
    takeaway: "写工具描述时，明确何时使用、何时不要使用。",
    keywords: ["tool calling", "schema", "description", "model"],
  },
  {
    id: "tool-result-shape",
    category: "tool",
    title: "工具结果需要为下一步决策服务",
    summary:
      "结果不仅要返回数据，还要提供稳定标识、状态、可恢复错误和下一步所需的最小上下文。",
    takeaway: "好的工具返回值能减少模型猜测和重复调用。",
    keywords: ["result", "error", "context", "structured output"],
  },
  {
    id: "sandbox-capability",
    category: "sandbox",
    title: "Sandbox 管理的是能力，不只是目录",
    summary:
      "文件读写、网络、进程、设备与凭证是不同能力维度。仅限制路径，无法覆盖命令执行和外部副作用。",
    takeaway: "按能力建模权限，并让拒绝原因可见。",
    keywords: ["sandbox", "filesystem", "network", "capability"],
  },
  {
    id: "sandbox-reproducible",
    category: "sandbox",
    title: "隔离环境也应该可复现",
    summary:
      "依赖版本、环境变量、工作目录和时间都会影响结果。可复现的 Sandbox 才能让失败被稳定诊断。",
    takeaway: "记录输入、环境与副作用，别只保存最后输出。",
    keywords: ["reproducibility", "environment", "dependency", "trace"],
  },
  {
    id: "coding-agent-task-shape",
    category: "coding agents",
    title: "任务边界比提示词长度更重要",
    summary:
      "明确目标、不可触碰范围、验证方式和完成条件，通常比堆叠更多背景文字更能提升编码 Agent 的成功率。",
    takeaway: "让 Agent 知道什么叫完成，也知道什么不能改。",
    keywords: ["coding agent", "scope", "acceptance", "verification"],
  },
  {
    id: "coding-agent-evidence",
    category: "coding agents",
    title: "让验证结果成为工作的一部分",
    summary:
      "测试、构建、截图和差异检查不是最后补上的仪式，而是 Agent 决策循环中的反馈信号。",
    takeaway: "要求证据，而不是只要求一句“已完成”。",
    keywords: ["test", "build", "screenshot", "evidence"],
  },
  {
    id: "digital-agent-continuity",
    category: "Digital agents",
    title: "数字 Agent 需要连续性",
    summary:
      "身份、目标、记忆和当前状态必须能跨任务保持一致，同时允许用户检查、修正和清除。",
    takeaway: "连续性来自可管理的状态，不来自无限增长的上下文。",
    keywords: ["digital agent", "identity", "memory", "state"],
  },
  {
    id: "digital-agent-handoff",
    category: "Digital agents",
    title: "可靠的交接比完全自治更重要",
    summary:
      "当权限不足、事实不确定或决策代价过高时，Agent 应把已知信息、尝试过程和待选方案清楚交还给人。",
    takeaway: "把“何时停下来交接”设计成系统能力。",
    keywords: ["digital agent", "handoff", "autonomy", "human in the loop"],
  },
];
