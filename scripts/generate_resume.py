from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "wangliangsheng-resume.pdf"

INK = HexColor("#202B26")
MUTED = HexColor("#718078")
LINE = HexColor("#D8DFDA")
ACCENT = HexColor("#C85E49")
FIELD = HexColor("#E8ECE8")
PAPER = HexColor("#F3F5F1")

pdfmetrics.registerFont(
    TTFont("ResumeCN", "/System/Library/Fonts/STHeiti Light.ttc", subfontIndex=0)
)


def paragraph(canvas: Canvas, text: str, x: float, y: float, width: float, style: ParagraphStyle) -> float:
    item = Paragraph(text, style)
    _, height = item.wrap(width, 100 * mm)
    item.drawOn(canvas, x, y - height)
    return y - height


def section_label(canvas: Canvas, label: str, y: float) -> float:
    canvas.setFont("ResumeCN", 7)
    canvas.setFillColor(ACCENT)
    canvas.drawString(20 * mm, y, label)
    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, y - 3 * mm, 190 * mm, y - 3 * mm)
    return y - 10 * mm


def build_resume() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(OUTPUT), pagesize=A4)
    page_width, page_height = A4
    canvas.setTitle("wangliangsheng - 前端 / AI Agent 工程师")
    canvas.setAuthor("wangliangsheng")
    canvas.setSubject("个人简历")

    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, page_width, page_height, fill=1, stroke=0)

    body = ParagraphStyle(
        "body",
        fontName="ResumeCN",
        fontSize=9.2,
        leading=15,
        textColor=INK,
        alignment=TA_LEFT,
    )
    small = ParagraphStyle(
        "small",
        fontName="ResumeCN",
        fontSize=7.8,
        leading=12,
        textColor=MUTED,
    )
    item_title = ParagraphStyle(
        "item-title",
        fontName="ResumeCN",
        fontSize=11,
        leading=15,
        textColor=INK,
    )

    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 25)
    name = "wangliangsheng"
    canvas.drawString(20 * mm, page_height - 25 * mm, name)
    canvas.setFillColor(ACCENT)
    name_width = pdfmetrics.stringWidth(name, "Helvetica-Bold", 25)
    canvas.circle(20 * mm + name_width + 2.5 * mm, page_height - 23.3 * mm, 1.1 * mm, fill=1, stroke=0)

    canvas.setFont("ResumeCN", 12)
    canvas.setFillColor(INK)
    canvas.drawString(20 * mm, page_height - 35 * mm, "前端 / AI Agent 工程师")

    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(190 * mm, page_height - 25 * mm, "github.com/wanglsh97")
    canvas.drawRightString(190 * mm, page_height - 31 * mm, "x.com/wang_ls97")
    canvas.drawRightString(190 * mm, page_height - 37 * mm, "wanglsh97.github.io")

    y = page_height - 55 * mm
    y = section_label(canvas, "PROFILE / 简介", y)
    y = paragraph(
        canvas,
        "关注界面与智能系统的交界：从可感知的交互，到可靠的 Agent 工作流。"
        "擅长把模糊需求拆成可维护的界面、工具与流程，让复杂能力以自然、清晰的方式抵达用户。",
        20 * mm,
        y,
        170 * mm,
        body,
    )

    y -= 10 * mm
    y = section_label(canvas, "PRACTICE / 工作方向", y)

    columns = [
        ("产品级前端", "构建稳定、可访问、响应式的 Web 体验，关注信息结构、组件边界与交互细节。"),
        ("Agent 工程", "设计上下文、工具调用与任务编排，让模型能力进入可控、可维护的工作流。"),
        ("界面 × 智能", "把不确定的模型能力翻译成用户看得懂、信得过、用得顺的产品交互。"),
    ]
    column_width = 52 * mm
    for index, (title, text) in enumerate(columns):
        x = 20 * mm + index * 59 * mm
        canvas.setFillColor(FIELD)
        canvas.roundRect(x, y - 31 * mm, column_width, 34 * mm, 2 * mm, fill=1, stroke=0)
        paragraph(canvas, title, x + 4 * mm, y - 5 * mm, column_width - 8 * mm, item_title)
        paragraph(canvas, text, x + 4 * mm, y - 14 * mm, column_width - 8 * mm, small)
    y -= 43 * mm

    y = section_label(canvas, "SELECTED WORK / 代表项目", y)
    canvas.setFillColor(INK)
    canvas.setFont("ResumeCN", 11)
    canvas.drawString(20 * mm, y, "交互式个人主页")
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(190 * mm, y, "React  /  TypeScript  /  Canvas  /  GitHub Pages")
    y -= 8 * mm
    y = paragraph(
        canvas,
        "围绕求职转化重新设计中文个人主页，并实现键盘躲避游戏「静默航线」。"
        "游戏支持方向键与 WASD 操作，包含键盘焦点、得分记录与减少动态效果适配。",
        20 * mm,
        y,
        170 * mm,
        body,
    )
    y -= 4 * mm
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(ACCENT)
    canvas.drawString(20 * mm, y, "github.com/wanglsh97/wanglsh97.github.io")

    y -= 13 * mm
    y = section_label(canvas, "TOOLKIT / 技术栈", y)
    tags = [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "Agent Workflow",
        "RAG",
        "Tool Calling",
    ]
    x = 20 * mm
    for tag in tags:
        tag_width = pdfmetrics.stringWidth(tag, "Helvetica", 7.5) + 9 * mm
        if x + tag_width > 190 * mm:
            x = 20 * mm
            y -= 10 * mm
        canvas.setFillColor(FIELD)
        canvas.roundRect(x, y - 5 * mm, tag_width, 7.5 * mm, 3.75 * mm, fill=1, stroke=0)
        canvas.setFillColor(INK)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawCentredString(x + tag_width / 2, y - 2.7 * mm, tag)
        x += tag_width + 2.5 * mm

    canvas.setStrokeColor(LINE)
    canvas.line(20 * mm, 18 * mm, 190 * mm, 18 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("ResumeCN", 7)
    canvas.drawString(20 * mm, 12 * mm, "更多项目与最新进展请见 GitHub")
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(190 * mm, 12 * mm, "Updated 2026.07")

    canvas.showPage()
    canvas.save()


if __name__ == "__main__":
    build_resume()
