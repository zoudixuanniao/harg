# 小红书视频文案爬虫

> 用于抓取某个博主主页下可见的视频笔记文案，并导出为 `txt`。

## 1. 安装

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m playwright install chromium
```

## 2. 首次登录（保存 Cookie）

```bash
python xhs_crawler.py login --profile-url "https://www.xiaohongshu.com/user/profile/<user_id>"
```

会弹出浏览器，请手动完成登录，然后回终端按回车，登录态将保存在 `xhs_auth_state.json`。

## 3. 抓取并输出 TXT

```bash
python xhs_crawler.py crawl \
  --profile-url "https://www.xiaohongshu.com/user/profile/<user_id>" \
  --output ./output/xhs_videos.txt
```

可选参数：

- `--max-notes 20`：最多抓取 20 条视频。
- `--headless`：无头模式运行。

## 4. 说明

- 小红书前端结构会变动，脚本已做多路径解析，但仍可能需要按页面变化微调。
- 请在遵守平台规则和法律法规的前提下使用。

---

## 心理时光机网页（React）

已新增一个可以在电脑本地运行的 React 网页版本（代码在 `src/App.jsx`）。

### 启动方式

```bash
npm install
npm run dev
```

启动后打开终端里显示的本地地址（通常是 `http://localhost:5173`）。

### 打包

```bash
npm run build
```
