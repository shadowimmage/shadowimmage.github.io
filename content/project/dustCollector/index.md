---
title: "Dust Collector - UW"
date: 2017-03-10
publishDate: 
lastMod: 2018-05-11
tags: [project, 3d printing, uw, fusion360]
type: "post"
draft: false
resources:
- src: "images/dustCollectorDrawing.jpg"
  title: "Dust Collector Drawing"
- src: "images/dustCollectorRendering.png"
  title: "Dust Collector Rendering"
- src: "images/filterScanDrawing.jpg"
  title: "Filter Scan Drawing"
---

We have a hammer drill that has a vacuum collector attachment, and we wanted a collector that could use different kinds of filters. I took the existing dust collector and designed an exact replacement that would take any kind of 3M respirator filter as the filter element. This allows using different kinds of filters and for the filters to be replaced. The parts involved were manually reverse-engineered on paper with the device and a set of good digital calipers. The replacement parts were designed in Autodesk [Fusion360][1] and 3D printed on a [Prusa][2] i3 MK2.

<!--more-->

## Reverse Engineering a Device

Digital calipers are infinitely helpful when trying to reverse engineer or copy a physical object with 3D CAD and 3D Printing. Dimension all the parts on a drawing and then use those measurements to create the 3D model in CAD. This was a challenging project, and one of the most complex models that I've ever had to engineer. The result was a device that was a perfect 1:1 fit in the overall vacuum body.

## Challenges

The original filter device didn't need to have any moving parts, and the filter was build into the wall between the chamber and the outlet. For my design I had to get a round filter to attach to a rectangular shaft, and also position the connection point somewhere where the filter could be folded around into the rectangular space of the dust chamber. Using a lofted profile allowed me to blend the rectangular outlet port into a circular tube to connect with the filter body. This worked well and maintained equal or greater volume between the filter connection point and the outlet port (no pinch point for the airflow).

The other challenge was designing a sliding joint that would hopefully be tight enough to seal, keeping the dust contained within the chamber and maintaining vacuum pressure. It took several test prints with small cut-away sections of the sliding joint between the two halves to get the tolerances just right to be tight without being loose or impossible to slide. This was definitely helped by making sure that the 3D printer was well calibrated and consistent throughout the entire print.

## Drawings

{{< gallery >}}
{{< figure src="images/dustCollectorDrawing.jpg" caption="Reference measurements taken from the original device" >}}
{{< figure src="images/filterScanDrawing.jpg" caption="Reference measurements taken from a sample filter scan" >}}
{{< /gallery >}}

## Results

Below is a rendering of the 3D model from Fusion360. Unfortunately I neglected to take any photos of the finished 3D print.

{{< figure src="images/dustCollectorRendering.png" >}}

---

[1]: https://www.autodesk.com/products/fusion-360/overview
[2]: https://www.prusa3d.com/