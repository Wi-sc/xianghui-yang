---
title: "Tencent Hunyuan3D-1.0: A Unified Framework for Text-to-3D and
Image-to-3D Generation"
authors:

- admin*
- Huiwen Shi*
- Bowen Zhang*
- Fan Yang
- Jiacheng Wang
- Hongxu Zhao
- Xinhai Liu,
- Xinzhou Wang
- Qingxiang Lin
- Jiaao Yu
- Lifu Wang
- Zhuo Chen
- Sicong Liu,
- Yuhong Liu
- Yong Yang
- Di Wang
- Jie Jiang
- Chunchao Guo
author_notes:
# - "Equal contribution"
# - "Equal contribution"
date: "2024-11-05T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2024-11-05T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["4"]

# Publication name and optional abbreviated publication name.
publication: ""
publication_short: ""

abstract: While 3D generative models have greatly improved artists’ workflows, the existing diffusion models for 3D generation suffer from slow generation and poor generalization. To address this issue, we propose a two-stage approach named Hunyuan3D-1.0 including a lite version and a standard version, that both support text- and image-conditioned generation. In the first stage, we employ a multi-view diffusion model that efficiently generates multiview RGB in approximately 4 seconds. These multi-view images capture rich details of the 3D asset from different viewpoints, relaxing the tasks from single-view to multi-view reconstruction. In the second stage, we introduce a feedforward reconstruction model that rapidly and faithfully reconstructs the 3D asset given the generated multi-view images in approximately 7 seconds. The reconstruction network learns to handle noises and in-consistency introduced by the multi-view diffusion and leverages the available information from the condition image to efficiently recover the 3D structure. Our framework involves the text-to-image model, i.e., Hunyuan-DiT, making it a unified framework to support both text- and image-conditioned 3D generation. Our standard version has 3× more parameters than our lite and other existing model. Our Hunyuan3D-1.0 achieves an impressive balance between speed and quality, significantly reducing generation time while maintaining the quality and diversity of the produced assets.

# Summary. An optional shortened abstract.
summary: We propose a two-stage approach named Hunyuan3D-1.0 including a lite version and a standard version, that both support text- and image-conditioned generation. In the first stage, we employ a multi-view diffusion model that efficiently generates multiview RGB in approximately 4 seconds. In the second stage, we introduce a feedforward reconstruction model that rapidly and faithfully reconstructs the 3D asset given the generated multi-view images in approximately 7 seconds.

tags:
- 3D Generation
featured: true

# links:
# - name: ""
#   url: ""
url_pdf: https://arxiv.org/pdf/2411.02293
url_code: https://github.com/Tencent/Hunyuan3D-1/tree/main
url_dataset: ''
url_poster: ''
url_project: http://3d-models.hunyuan.tencent.com/
url_slides: ''
url_source: ''
url_video: ''

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
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
