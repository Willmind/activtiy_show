# 曾慧仪 · 行政活动作品集

面向行政专员求职的中文作品集。包含 8 类活动、22 张活动素材、独立活动详情、分类浏览、完整长图阅读、图片放大切换、工作经历及简历 PDF 下载。

公开网站：https://zeng-huiyi-portfolio.tan13126476635.chatgpt.site

## 开发

需要 Node.js 22.13 或以上。

```bash
npm ci
npm run dev
```

```bash
npm exec tsc -- --noEmit
npm run build
```

项目使用 React、Vinext 与 Tailwind CSS。`next.config.ts` 配置静态导出，发布文件位于 `dist/client/`，可由静态托管服务提供访问。Sites 发布配置位于 `.openai/hosting.json`。当前资源和导航以站点根路径为基础；如改用 GitHub Pages 项目子路径，需要统一配置前缀后重新构建。

国内访问的域名、托管及上传步骤见 [国内访问部署](docs/国内访问部署.md)。可使用 `scripts/package_edgeone.py` 将构建结果打包为可直接上传的 ZIP。

## 内容维护

- `data/activities.ts`：活动名称、分类、介绍、展示要点与图片说明。
- `data/images.json`：自动生成的图片与分段信息。
- `components/portfolio/resume-section.tsx`：工作经历、教育及简历成果。
- `public/resume/zeng-huiyi-resume.pdf`：用户提供的完整简历。
- `public/images/activities/`：用于网站展示的 WebP 图片。

端午和 23 楼入驻活动按用户要求不作为个人主导作品展示，相关页面和网站图片已移除；原图及完整分辨率 WebP 存档仍保留在本地。图片脚本只为其生成本地存档，不再生成网站资源。

活动介绍根据用户提供的分类与图片内容整理，未将简历中的总体业绩归因到某一场未明确对应的活动，也未推断活动人数、预算、日期或个人设计著作权。工作经历与数值依据用户提供的简历；简历声明 5 年行政经验，目前列出的两段工作经历覆盖 2024 年 7 月至 2026 年 6 月，其他经历待用户补充。

## 图片处理

原始 PNG/JPG 在本地活动文件夹保存，不提交到此仓库。另有完整分辨率的 WebP 存档位于该文件夹的 `webp_out/`；网站使用适合屏幕阅读的派生版本。

安装带 WebP 支持的 Pillow 后，可重新生成：

```bash
python3 scripts/prepare_images.py '/path/to/活动图片' --site-output '/path/to/activtiy_show'
```

处理步骤包括校正照片方向、处理可用的色彩配置、编码 WebP、生成封面、长图分段，并验证每个输出能解码。完整分辨率存档使用质量 90（照片）和 92（长图），属于高质量有损压缩，并非逐像素无损。唯一超过 WebP 尺寸限制的端午长图按顺序分成 3 段，完整保留原始宽度与内容。

本次 32 张原图共 150,597,282 字节，转换后的 34 个完整分辨率 WebP 文件共 34,641,058 字节，体积减少 77.00%。完整清单和原图 SHA-256 在本地 `webp_out/转换报告.json`。

## 发布内容

仓库包含用户提供的活动素材和简历，仅用于作品展示。页面使用本地字体栈，无外部字体或分析脚本依赖。更新简历、邮箱和到岗状态时，请同步修改简历组件及首页状态。
