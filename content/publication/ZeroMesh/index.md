---
title: "ZeroMesh: Zero-shot Single-view 3D Mesh Reconstruction"
authors:
- admin
- Guosheng Lin
- Luping Zhou
author_notes:
# - "Equal contribution"
# - "Equal contribution"
date: "2021-09-01T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["2"]

# Publication name and optional abbreviated publication name.
publication: "*Transactions on Image Processing*(1)"
publication_short: "TIP"

abstract: Single-view 3D object reconstruction is a fundamental and challenging computer vision task that aims at recovering 3D shapes from single-view RGB images. Most existing deep learning based reconstruction methods are trained and evaluated on the same categories, and they cannot work well when handling objects from novel categories that are not seen during training. Focusing on this issue, this paper tackles Zero-shot Single-view 3D Mesh Reconstruction, to study the model generalization on unseen categories and encourage models to reconstruct objects literally. Specifically, we propose an end-to-end twostage network, ZeroMesh, to break the category boundaries in reconstruction. Firstly, we factorize the complicated image-tomesh mapping into two simpler mappings, i.e., image-to-point mapping and point-to-mesh mapping, while the latter is mainly a geometric problem and less dependent on object categories. Secondly, we devise a local feature sampling strategy in 2D and 3D feature spaces to capture the local geometry shared across objects to enhance model generalization. Thirdly, apart from the traditional point-to-point supervision, we introduce a multi-view silhouette loss to supervise the surface generation process, which provides additional regularization and further relieves the overfitting problem. The experimental results show that our method significantly outperforms the existing works on the ShapeNet and Pix3D under different scenarios and various metrics, especially for novel objects.

# Summary. An optional shortened abstract.
summary: We propose an end-to-end twostage network, ZeroMesh, to break the category boundaries in reconstruction. Firstly, we factorize the complicated image-tomesh mapping into two simpler mappings, i.e., image-to-point mapping and point-to-mesh mapping, while the latter is mainly a geometric problem and less dependent on object categories. Secondly, we devise a local feature sampling strategy in 2D and 3D feature spaces to capture the local geometry shared across objects to enhance model generalization. Thirdly, apart from the traditional point-to-point supervision, we introduce a multi-view silhouette loss to supervise the surface generation process, which provides additional regularization and further relieves the overfitting problem.

tags:
- Single-view Reconstruction
featured: true

# links:
# - name: ""
#   url: ""
url_pdf: https://arxiv.org/abs/2208.02676
url_code: ''
url_dataset: ''
url_poster: ''
url_project: ''
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
