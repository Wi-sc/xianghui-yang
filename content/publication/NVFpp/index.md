---
title: "Neural Vector Fields: Generalizing Distance Vector Fields by Codebooks and Zero-Curl Regularization"
authors:
- admin
date: "2023-08-07T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2023-08-07T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["3"]

# Publication name and optional abbreviated publication name.
publication: ""
publication_short: ""

abstract: Recent neural networks based surface reconstruction can be roughly divided into two categories, one warping templates explicitly and the other representing 3D surfaces implicitly. To enjoy the advantages of both, we propose a novel 3D representation, Neural Vector Fields (NVF), which adopts the explicit learning process to manipulate meshes and implicit unsigned distance function (UDF) representation to break the barriers in resolution and topology. This is achieved by directly predicting the displacements from surface queries and modeling shapes as Vector Fields, rather than relying on network differentiation to obtain direction fields as most existing UDF-based methods do. In this way, our approach is capable of encoding both the distance and the direction fields so that the calculation of direction fields is differentiation-free, circumventing the non-trivial surface extraction step. Furthermore, building upon NVFs, we propose to incorporate two types of shape codebooks, \ie, NVFs (Lite or Ultra), to promote cross-category reconstruction through encoding cross-object priors. Moreover, we propose a new regularization based on analyzing the zero-curl property of NVFs, and implement this through the fully differentiable framework of our NVF (ultra). We evaluate both NVFs on four surface reconstruction scenarios, including watertight vs non-watertight shapes, category-agnostic reconstruction vs category-unseen reconstruction, category-specific, and cross-domain reconstruction.

# Summary. An optional shortened abstract.
summary: 3D Reconstruction, Implicit Representation

tags:
- 3D Reconstruction
- Implicit Representation
featured: false

links:
- name: Custom Link
  url: https://arxiv.org/abs/2309.01512
url_pdf: https://arxiv.org/abs/2309.01512
url_code: ''
url_dataset: '#'
url_poster: '#'
url_project: ''
url_slides: ''
url_source: '#'
url_video: '#'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: ''
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
- internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: example
---

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/).
