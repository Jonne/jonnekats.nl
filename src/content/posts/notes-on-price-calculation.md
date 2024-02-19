---
title:  "Notes on the SXC9 price calculation"
date: 2018-06-27
author: jonnekats
comments: true
keywords: Sitecore 9, SXC9, pricing, listprice, sellprice, commerce
image: ./images/price-calculation.jpg
tags: [Sitecore]
description: "Today I needed to sort sellable items based on the listprice, which required me to do a deep dive into the SXC9 price calculation. This turned out to be not that trivial, so here are my notes."
---
A sellable item has a **listprice** and a **sellprice**. According to the documentation, the listprice is the general price and the sellprice is the "personalized" price and is calculated using the configured price books. Because the sell price can vary between customers, it has to be requested from the commerce engine with a special bulkprices requests. This means that you won't see a sell price when you open the sellable item in the content editor. Suprisingly, the list price also needs to be requested using the bulkprices request and also doesn't show up in the content editor. The default list price calculation simply returns the listprice that is defined on the ListPricingPolicy of the sellable item. I can guess the listprice is not returned by default so you can still extend it to be more dynamic. 

When you request a sellable item using the Sitecore data provider or when you use the sitecore index (That has been updated using the data provider via the sellableitemscrawler), you can simply execute the bulkprices request to add the prices after you have retrieved the sellable items. But what if you want to sort on listprice or have another reason for adding the listprice to the index? 

I've been sparring on this with Richard Szalay on the Sitecore slack channel and he had some great ideas, but I didn't get them to work. Richard has an [excellent post](https://blog.richardszalay.com/2018/04/23/commerce-sellableitem-facet/) on how to add a facet based on a custom field, but the listprice turns out to be a special case. 

Because the list price is already available in the `ListPricingPolicy` of the SellableItem, we had hoped that simply configuring the field in a custom child view of the sellable items view would get the job done. This didn't work, after which I decided to disassemble the data provider to learn more about its inner workings. I found out that the GetEntityView pipeline is used to generate the commerce templates when you update the data templates using the commerce Ribbon. When you request a sellable item, the data provider retrieves the sellable item from the commerce engine and uses the fields defined in the template to get the values. However, it only looks for fields directly on the sellable items and its child components. It doesn't looks for values in the policies of the sellable item.  

Next, I tried setting the listprice field of the sellable item directly in the import, but this field get reset to null when the sellable item is retrieved. 

All this led me to the conclusion that currently the only way to add the list price to the index, is by copying the listprice to a field on a custom component. When you create the sellable item, you add the `ListPricingPolicy` to the sellable item and also copy the list price value to your custom field. Then follow the steps in Richard's post and the list price should be available in the index. One thing though, I tried to name the field on my custom component listprice, but for some reason the value didn't show up in the content editor. When I renamed it to DisplayPrice, the value showed up in the content editor and also got indexed.  


