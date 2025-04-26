---
title: "Hunyuan3D-2.0: Scaling Diffusion Models for High Resolution Textured 3D Assets Generation"
authors:
- Zibo Zhao
- Zeqiang Lai
- Qingxiang Lin
- Yunfei Zhao
- Haolin Liu
- Shuhui Yang
- Yifei Feng
- Mingxin Yang
- Sheng Zhang
- admin
- Huiwen Shi
- Sicong Liu
- Junta Wu
- Yihang Lian
- Fan Yang
- Ruining Tang
- Zebin He
- Xinzhou Wang
- Jian Liu
- Xuhui Zuo
- Zhuo Chen
- Biwen Lei
- Haohan Weng
- Jing Xu
- Yiling Zhu
- Xinhai Liu
- Lixin Xu
- Changrong Hu
- Shaoxiong Yang
- Song Zhang
- Yang Liu
- Tianyu Huang
- Lifu Wang
- Jihong Zhang
- Meng Chen
- Liang Dong
- Yiwen Jia
- Yulin Cai
- Jiaao Yu
- Yixuan Tang
- Hao Zhang
- Zheng Ye
- Peng He
- Runzhou Wu
- Chao Zhang
- Yonghao Tan
- Jie Xiao
- Yangyu Tao
- Jianchen Zhu
- Jinbao Xue
- Kai Liu
- Chongqing Zhao
- Xinming Wu
- Zhichao Hu
- Lei Qin
- Jianbing Peng
- Zhan Li
- Minghui Chen
- Xipeng Zhang
- Lin Niu
- Paige Wang
- Yingkai Wang
- Haozhao Kuang
- Zhongyi Fan
- Xu Zheng
- Weihao Zhuang
- YingPing He
- Tian Liu
- Yong Yang
- Di Wang
- Yuhong Liu
- Jie Jiang
- Jingwei Huang
- Chunchao Guo 
  
author_notes:
# - "Equal contribution"
# - "Equal contribution"
date: "2025-1-23T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2025-1-21T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["4"]

# Publication name and optional abbreviated publication name.
publication: ""
publication_short: ""

abstract: We present Hunyuan3D 2.0, an advanced large-scale 3D synthesis system for generating high-resolution textured 3D assets. This system includes two foundation components: a large-scale shape generation model -- Hunyuan3D-DiT, and a large-scale texture synthesis model -- Hunyuan3D-Paint. The shape generative model, built on a scalable flow-based diffusion transformer, aims to create geometry that properly aligns with a given condition image, laying a solid foundation for downstream applications. The texture synthesis model, benefiting from strong geometric and diffusion priors, produces high-resolution and vibrant texture maps for either generated or hand-crafted meshes. Furthermore, we build Hunyuan3D-Studio -- a versatile, user-friendly production platform that simplifies the re-creation process of 3D assets. It allows both professional and amateur users to manipulate or even animate their meshes efficiently. We systematically evaluate our models, showing that Hunyuan3D 2.0 outperforms previous state-of-the-art models, including the open-source models and closed-source models in geometry details, condition alignment, texture quality, and etc. Hunyuan3D 2.0 is publicly released in order to fill the gaps in the open-source 3D community for large-scale foundation generative models.

# Summary. An optional shortened abstract.
summary: Hunyuan3D 2.0 is an advanced large-scale 3D synthesis system designed to generate high-resolution textured 3D assets. It consists of two core components: Hunyuan3D-DiT, a scalable flow-based diffusion transformer for shape generation that ensures alignment with input conditions, and Hunyuan3D-Paint, a texture synthesis model that produces high-quality, vibrant textures using geometric and diffusion priors. Additionally, Hunyuan3D-Studio provides a user-friendly platform for asset creation, manipulation, and animation, catering to both professionals and amateurs. Evaluations demonstrate that Hunyuan3D 2.0 surpasses previous state-of-the-art models (both open- and closed-source) in geometry detail, condition alignment, and texture quality. The system is publicly released to advance the open-source 3D generative modeling community.

tags:
- 3D Generation
featured: true

# links:
# - name: ""
#   url: ""
url_pdf: https://arxiv.org/pdf/2501.12202
url_code: https://github.com/Tencent/Hunyuan3D-2/tree/main
url_dataset: ''
url_poster: ''
url_project: http://3d-models.hunyuan.tencent.com/
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Unsplash**](https://private-user-images.githubusercontent.com/26198430/424413082-efb402a1-0b09-41e0-a6cb-259d442e76aa.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDU2NzE0ODcsIm5iZiI6MTc0NTY3MTE4NywicGF0aCI6Ii8yNjE5ODQzMC80MjQ0MTMwODItZWZiNDAyYTEtMGIwOS00MWUwLWE2Y2ItMjU5ZDQ0MmU3NmFhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MjYlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDI2VDEyMzk0N1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWYyOTU0MWNhMmE4ZWZmMzU5MzIyMzk4MGFhZDA2NWU1YzE5NmFlMjA4MjNjNDFlZjc0ZDJmNmFhOGQyYmMwMDQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.XCZlp0hL9jrnfy8vm82xmyK2evDQyWZlFkYeD1SDGsw)'
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: example
---

{{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/).
