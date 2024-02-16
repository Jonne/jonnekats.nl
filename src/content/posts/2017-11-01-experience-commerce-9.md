---
title:  "Sitecore Experience Commerce 9"
canonical: https://mercury-ecommerce.com/tech/sitecore-experience-commerce-9
keywords: Sitecore 9, Commerce 9, Mercury
description: Goodbye old Commerceserver code, hello new Commerce engine.
date: 2017-11-01
author: jonnekats
comments: true
tags: [Sitecore]
---
Last week, the Mercury team attended the Sitecore Symposium in Las Vegas. There were a lot of great announcements, not least that Sitecore Experience Commerce 9 is to be launched in Q1 of 2018. Although Sitecore Commerce 8.2.1. was a huge step forward, it is a hybrid between old and new versions, which brought its own complexity.  

<!--more-->

Sitecore Commerce 8.2.1. introduced a brand new Commerce Engine for the transaction and discount system that is based on .NET Core and runs out of process. The catalog, inventory and profile systems have not been changed, which led to a hybrid situation and a steep learning curve, especially for people new to both Commerce Server and Sitecore Commerce.

You can read all about the 8.2.1. release in this [blog post](https://commerceservertips.com/sitecore-commerce-8-2-1-whats-in-the-box/) by my colleague Erwin Werkman.

In Sitecore Experience Commerce 9, the catalog, inventory and profile systems have been moved over to the new Commerce Engine. You no longer need the old Commerce Server install and all the old Commerce Server code is gone. Commerce Server has always served us well (we’ve been using Commerce Server for more than 17 years) and it's hard not to feel a bit nostalgic. However, all the improvements brought by the new engine quickly replace any nostalgia with a feeling of excitement. 

For instance, the simplified installation of the new engine makes it possible to use Commerce 9 on Azure PAAS, and it should even be possible to run Commerce 9 in a Docker container. In addition to simplifying deployment, Commerce 9 also greatly reduces the development complexity because you don't have to deal with two different systems anymore. This is a big milestone and Sitecore Senior VP of Product Management Ryan Donovan seems to share our sentiment:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Final <a href="https://twitter.com/hashtag/SitecoreSym?src=hash&amp;ref_src=twsrc%5Etfw">#SitecoreSym</a> thought: RIP Commerce Server 1997-2017. No code left! Long live Sitecore Commerce 9 &amp; beyond! HatTip: <a href="https://twitter.com/CommerceServer?ref_src=twsrc%5Etfw">@CommerceServer</a></p>&mdash; Ryan R. Donovan (@ryan_donovan) <a href="https://twitter.com/ryan_donovan/status/921576615926263808?ref_src=twsrc%5Etfw">October 21, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
ge
All the business management tools are now accessible through the same web-based user interface, which is consistent with the normal Sitecore user interface. Before, some of the tools were separate smart clients that had to be installed on the business user’s machine. At least, the following business tools will be available:
 
Merchandising manager
Pricing and promotion manager
Customer and order manager
The new business management tools are extensible through the use of plugins and are a lot easier to extend than the old business tools. Additionally, these new tools are based on SPEAK 3, which is based on the Angular JavaScript framework instead of Sitecore's proprietary UI framework (yeah!).

The data model of the catalog system roughly remains the same as before. One of the things which is  different is that now a product doesn't necessarily need to be part of a catalog. Although the persistency layer is brand new, the catalog is still exposed in Sitecore through a data provider and the catalog items are displayed in the content editor. In my experience, the old catalog data provider is no pod racer, so I have high expectations of the performance of the new catalog system and data provider.

The new inventory system now supports multiple locations with a concept called ‘inventory sets’. Each location can have its own inventory set and inventory can be transferred between sets. Variants are supported, and the model is fully extensible by composition, making it possible to support customer specific scenarios. 

Sitecore also announced the release of SXA storefront components. This is basically SXA (Sitecore Experience Accelerator) but for commerce. There will be around 40 components out of the box. SXA storefront components are based on Helix and are a great example of how to build your own storefront. If you would rather have extensible components that cover the entire storefront (120+ production-ready components), take a look at our product: [Mercury E-commerce](https://mercury-ecommerce.com/sitecore-storefront). 

Overall, Sitecore Experience Commerce 9 is a great milestone in Sitecore Commerce. A technical preview should now be available and there will be migration tools in the SDK to help you migrate your data from previous versions. Looking forward, Sitecore has announced B2B functionality that will land in 9.1 or later. The future looks bright!