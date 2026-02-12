#!/usr/bin/env python3
"""小红书博主视频文案爬取工具。

使用方式（推荐）：
1. 安装依赖：pip install -r requirements.txt
2. 首次登录并保存会话：
   python xhs_crawler.py login --profile-url "https://www.xiaohongshu.com/user/profile/<user_id>"
3. 抓取文案：
   python xhs_crawler.py crawl --profile-url "https://www.xiaohongshu.com/user/profile/<user_id>" --output output.txt
"""

from __future__ import annotations

import argparse
import re
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from playwright.sync_api import BrowserContext, Page, sync_playwright

STATE_PATH = Path("xhs_auth_state.json")


@dataclass
class NoteData:
    note_id: str
    title: str
    desc: str
    url: str


def _extract_note_id(url: str) -> str | None:
    m = re.search(r"/explore/([a-zA-Z0-9]+)", url)
    if not m:
        return None
    return m.group(1)


def _clean_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value).strip()


def _is_video_card(element) -> bool:
    html = (element.get_attribute("outerHTML") or "").lower()
    # 小红书页面结构经常变化，用多关键词兜底。
    keys = ["video", "play", "视频", "type=video", "note-type"]
    return any(k in html for k in keys)


def collect_video_note_links(page: Page, max_scroll: int = 120) -> list[str]:
    """在主页滚动，提取疑似视频笔记链接。"""
    links: set[str] = set()
    stagnant_rounds = 0
    last_total = 0

    for _ in range(max_scroll):
        cards = page.locator("a[href*='/explore/']")
        count = cards.count()
        for i in range(count):
            link = cards.nth(i)
            href = link.get_attribute("href")
            if not href:
                continue
            full_url = href if href.startswith("http") else f"https://www.xiaohongshu.com{href}"
            if _extract_note_id(full_url) and _is_video_card(link):
                links.add(full_url)

        page.mouse.wheel(0, 2200)
        page.wait_for_timeout(1200)

        if len(links) == last_total:
            stagnant_rounds += 1
        else:
            stagnant_rounds = 0
            last_total = len(links)

        if stagnant_rounds >= 8:
            break

    return sorted(links)


def _extract_note_from_state(state: dict, url: str) -> NoteData | None:
    """从页面状态对象中尝试解析文案。"""
    # 小红书前端状态结构可能变更，这里做多分支容错。
    candidates: list[dict] = []

    if isinstance(state, dict):
        note_data = state.get("note")
        if isinstance(note_data, dict):
            candidates.append(note_data)

        for k in ("noteDetailMap", "notes", "noteMap", "detail"):
            v = state.get(k)
            if isinstance(v, dict):
                candidates.extend([x for x in v.values() if isinstance(x, dict)])

    for item in candidates:
        title = _clean_text(item.get("title") or item.get("noteTitle"))
        desc = _clean_text(item.get("desc") or item.get("description") or item.get("content"))
        note_id = _clean_text(item.get("noteId") or item.get("id") or _extract_note_id(url) or "")

        if desc or title:
            return NoteData(note_id=note_id or "unknown", title=title, desc=desc, url=url)

    return None


def fetch_note_detail(context: BrowserContext, url: str) -> NoteData | None:
    page = context.new_page()
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2000)

        raw_state = page.evaluate(
            """() => {
                const keys = ['__INITIAL_STATE__', '__reduxStore', '__SERVER_STATE__'];
                for (const k of keys) {
                  if (window[k]) {
                    try {
                      if (k === '__reduxStore' && window[k].getState) {
                        return window[k].getState();
                      }
                      return window[k];
                    } catch (e) {}
                  }
                }
                return null;
            }"""
        )

        if isinstance(raw_state, dict):
            parsed = _extract_note_from_state(raw_state, url)
            if parsed:
                return parsed

        title = _clean_text(page.locator("h1").first.text_content())
        desc = _clean_text(page.locator("[class*='desc'], [class*='content']").first.text_content())
        note_id = _extract_note_id(url) or "unknown"
        if title or desc:
            return NoteData(note_id=note_id, title=title, desc=desc, url=url)

        return None
    finally:
        page.close()


def write_txt(notes: Iterable[NoteData], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        for idx, n in enumerate(notes, start=1):
            f.write(f"#{idx}\n")
            f.write(f"note_id: {n.note_id}\n")
            f.write(f"url: {n.url}\n")
            f.write(f"title: {n.title}\n")
            f.write("desc:\n")
            f.write(n.desc + "\n")
            f.write("\n" + "-" * 70 + "\n\n")


def do_login(profile_url: str, headless: bool) -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context()
        page = context.new_page()
        page.goto(profile_url, wait_until="domcontentloaded")
        print("请在打开的浏览器中完成登录，完成后回到终端按回车继续...")
        input()
        context.storage_state(path=str(STATE_PATH))
        print(f"登录态已保存：{STATE_PATH}")
        context.close()
        browser.close()


def do_crawl(profile_url: str, output: Path, max_notes: int, headless: bool) -> None:
    if not STATE_PATH.exists():
        raise FileNotFoundError(
            f"未找到 {STATE_PATH}，请先执行 login 子命令完成登录。"
        )

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(storage_state=str(STATE_PATH))
        page = context.new_page()

        print(f"打开主页：{profile_url}")
        page.goto(profile_url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(3000)

        links = collect_video_note_links(page)
        if max_notes > 0:
            links = links[:max_notes]

        print(f"共发现疑似视频笔记：{len(links)}")
        notes: list[NoteData] = []

        for i, link in enumerate(links, start=1):
            print(f"[{i}/{len(links)}] 抓取: {link}")
            try:
                note = fetch_note_detail(context, link)
                if note:
                    notes.append(note)
            except Exception as exc:
                print(f"  失败: {exc}")
            time.sleep(0.5)

        write_txt(notes, output)
        print(f"输出完成：{output}（共 {len(notes)} 条）")

        context.close()
        browser.close()


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="小红书博主视频文案爬取")
    sub = parser.add_subparsers(dest="command", required=True)

    login = sub.add_parser("login", help="登录并保存会话")
    login.add_argument("--profile-url", required=True, help="博主主页链接")
    login.add_argument("--headless", action="store_true", help="无头模式（不建议首次登录使用）")

    crawl = sub.add_parser("crawl", help="爬取视频文案并输出 txt")
    crawl.add_argument("--profile-url", required=True, help="博主主页链接")
    crawl.add_argument("--output", type=Path, default=Path("xhs_videos.txt"), help="输出 txt 路径")
    crawl.add_argument("--max-notes", type=int, default=0, help="最多抓取多少条，0 为不限")
    crawl.add_argument("--headless", action="store_true", help="无头模式")

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "login":
        do_login(args.profile_url, headless=args.headless)
    elif args.command == "crawl":
        do_crawl(
            profile_url=args.profile_url,
            output=args.output,
            max_notes=args.max_notes,
            headless=args.headless,
        )


if __name__ == "__main__":
    main()
