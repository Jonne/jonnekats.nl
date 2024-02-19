---
title:  "JSS Commerce part 7 - Conclusion"
date: 2019-10-07
author: jonnekats
comments: true
keywords: Sitecore 9, SXC9, commerce, JSS, sitecore, javascript services
image: ./images/commerce-conclusion.jpg
tags: [Sitecore]
description: "In the past 6 parts of this JSS Commerce series Joost Meijles and me described our experiences developing a basic Sitecore Commerce website with JSS. Most of the articles describe how we implemented a certain feature and why we did it that way. Now that we finished the experiment, we can look back and evaluate using JSS for Sitecore Commerce in a more general way. We will do this by asking ourselves a couple of questions."
---
> JSS Commerce parts:
1. [Exposing the Commerce Engine](/2019/exposing-the-commerce-engine/)
2. [Navigating the catalog](/2019/navigating-the-catalog/)
3. [Cart actions](https://joost.meijles.com/jss_cart_actions/) - Joost Meijles
4. [Tracking Cart events](https://joost.meijles.com/jss_tracking_commerce/) - Joost Meijles
5. [Implementing catalog pages](/2019/implement-catalog-pages/)
6. [Creating a product cluster](https://joost.meijles.com/jss_product_cluster/) - Joost Meijles
7. **Conclusion** 

## Do you prefer JSS to the more traditional Sitecore MVC approach for commerce websites?
Modern E-commerce websites offer a lot of functionality and need to be interactive in order to engage the customer. This requires running JavaScript in the browser. Adding some JavaScript to a Sitecore MVC implementation is fine, but at a certain amount it will get complex and hard to manage. Code runs in two different places: the ASP.NET code on the server and the JavaScript on the browser. Developers have to keep these two different worlds in mind when developing the application. The JavaScript code usually needs the MVC server to run, making it hard to test in isolation and result in slow development feedback loops. This is where JSS can really shine. It works really well for sites that need a lot of interaction. It offers quick development feedback loops, because front-end developers can work disconnected and don't need a running Sitecore server. Though one thing we noticed is that you generally need a lot of async calls to the server with Commerce sites, which will break JSS disconnected mode. This can be solved by adding custom stubs. 

The downside of using JSS for commerce is that you currently need to develop everything yourself. There currently is no JSS storefront, so you will need to build the UI components and infrastructure. This also means that there are a lot of design decisions to be made. For example, [how to expose the commerce functionality to the JSS Components](http://jonnekats.nl/2019/exposing-the-commerce-engine/), [how to share state between components](https://joost.meijles.com/jss_cart_actions/), etc. When you use the SXA storefront, you don't have to thinks about these kinds of things and can build your own components using the same architecture and patterns as the out of the box SXA components. 

## Is directly exposing the commerce engine for JSS worthwhile?
At the start of the experiment we were really excited about it, because it gave us a lot of development speed and saved us from dealing with the complexity of Sitecore Commerce Connect. However, at some point the mapping in the API gateway can get quite complex. Especially when you also want to shield Commerce Engine response bodies by doing transformations. Also, tracking commerce events turned out to be [more difficult](https://joost.meijles.com/jss_tracking_commerce/) than we initally envisioned. So, next time we decide to use JSS for a Sitecore Commerce project, we would probably decide to create a lightweight REST API and go through Sitecore Commerce Connect. 

## What do you like most about the chosen Commerce JSS solution?
We love the freedom and flexibility that you have in the front-end. The developer experience definitely is a big step up on this side. When you need a rich UI, JSS is a lot easier to use than integrating JavaScript with ASP.NET MVC. 

## What is the biggest drawback of the chosen Commerce JSS solution?
As mentioned before, the biggest drawback specifically with commerce JSS is that you currently need to figure out how to connect the different parts of the system and have to custom build a REST API and all the UI components. 
With JSS in general we found the following drawbacks: 
- **Front-end developer still needs to have Sitecore knowledge**

   The developers experience on the front-end is amazing. They can work disconnected, use the tools they know and like, etc. However, we found that the front-end engineer still needs to have a core knowledge of Sitecore. For example, when you start building features code-first you need to know what field types there are and when to use which one. 
- **High learning curve of the solution**

   A lot of new technology and concepts: development modes, workflows, server side rendering. 
- **Lack of guidance and examples**

   Although the JSS documentation is extensive, it seems some concepts are missing. For example, we ran into this issue that the JSS site was not working in the experience editor (Integrated mode). Apparently this was because some JSS items in our content tree were in the wrong workflow step.

## Would you use JSS for your next Sitecore Commerce project?
We would be willing to try it for a really simple e-commerce site with requirements similar to the features implemented by the SXA storefront. In our experience the type of e-commerce sites that choose Sitecore, are quite demanding in terms of functionality and scalability. For example, we know from experience (From building [Mercury](https://mercury-ecommerce.com/), a Sitecore Commerce accelerator) how much time it takes to build extensive filtering functionality and would not like to do this in a customer project. If you have to build all this functionality yourself, you will spend all time in the project doing this. Time that you would probably rather spend on features that make a difference, e.g. implementing a proper customer journey. 

## How much time did you spend on this experiment?
Overall we both (Joost & Jonne) worked on this for 3 weeks. Most of this time was spend on learning JSS and figuring out how to make JSS and commerce work together. Our velocity was amazing, but keep in mind that we kept the scope and problem space as small as possible. This is a really naive shop implementation.

## Show me the code?
You got it: [Repo on Github](https://github.com/avivasolutionsnl/jss-commerce)