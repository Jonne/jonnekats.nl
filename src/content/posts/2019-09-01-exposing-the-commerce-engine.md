---
title:  "JSS Commerce part 1 - Exposing the commerce engine"
date: 2019-09-01
author: jonnekats
comments: true
keywords: Sitecore 9, SXC9, commerce, JSS, sitecore, javascript services
image: ./images/expose-engine.jpg
tags: [Sitecore]
description: "This is the first article of a multi-part series in which my colleague Joost Meijles and I will share our experiences developing a Sitecore JSS site on top of Sitecore Commerce. In this part I will discuss the first challenge we faced: how to expose the Commerce Engine to JSS."
---
> JSS Commerce parts:
1. **Exposing the Commerce Engine**
2. [Navigating the catalog](/2019/navigating-the-catalog/)
3. [Cart actions](https://joost.meijles.com/jss_cart_actions/) - Joost Meijles
4. [Tracking Cart events](https://joost.meijles.com/jss_tracking_commerce/) - Joost Meijles
5. [Implementing catalog pages](/2019/implement-catalog-pages/)
6. [Creating a product cluster](https://joost.meijles.com/jss_product_cluster/) - Joost Meijles
7. [Conclusion](/2019/jss-commerce-conclusion/)

There are two ways to use Sitecore Commerce with JSS:

 - Use Sitecore Commerce Connect and create a custom endpoint that runs on Sitecore XP
 - Use the Commerce Engine directly from JSS (using API gateway)

## Create custom endpoint
This is the most obvious approach, because it allows you to leverage Commerce Connect. The advantage of Commerce Connect is that it reduces coupling with the Commerce Engine, enables extensibility and automatically enables commerce related analytics. The Connect pipelines contain processors that will trigger page events, for example: it will trigger an order-viewed page event that gets fired when the order is retrieved. The downside of this approach is that you cannot access Commerce Connect from JSS, because its headless and runs in a different process. This means that you will need to create a custom Web API to expose the Commerce Engine functionality used by the application. Not only is this a lot of work to set up initially, if you add custom functionality to the Engine you will now have to extend: the Engine, Commerce Connect AND your custom API.

![Expose using Commerce Connect and custom endpoint](/assets/images/expose-commerce-engine/commerceconnect.jpg))


## Expose Commerce Engine through API gateway
Alternatively you could choose to directly use the Commerce Engine API from JSS. This would safe you from having to create a custom API. Also, although Sitecore Commerce Connect adds flexibility and extensibility, we have noticed in past projects that this also adds complexity because of the mapping from the Commerce Connect concepts to those of the Commerce Engine. This is why we really wanted to experiment with using the Engine directly from JSS. The challenge here is that the Engine API does not seem to have been build to support this scenario. For example, how do we make sure anonymous users can only access their own cart? There is no [authorization](../sitecore-commerce-security-explained) on data level, meaning that an authenticated user can access all carts. Also, how dow we shield the user from  sensitive data on message level? One way to this is by using an [API Gateway](https://microservices.io/patterns/apigateway.html). An API Gateway allows you to create a new endpoint that proxies/reroutes requests to different service(s). Some of these gateways even allow you to transform the request and response messages.

![Expose through API gateway](/assets/images/expose-commerce-engine/directly.jpg)

Because this project was an experiment, we decided to use the Engine directly from JSS to see what impact this has on development speed and complexity of the solution. To be able to select an API gateway we needed to determine our requirements. We did this by selecting a couple of key scenario's and work out how we wanted to expose the relate API's. As an example, the API for retrieving a visitor's cart is displayed below: 

![Cart flow](/assets/images/expose-commerce-engine/cartflow.jpg)
 
When retrieving a cart, the Commerce Engine requires you to pass in a Cart Id. With Commerce Connect, the client application will usually pass in the current users Id as the cart Id, in order to get the current users' cart. We don't want to expose this API to JSS, because it will open up the application to brute force attacks. Instead, we would like to implement a mechanism to "anonymously authenticate" (What?) the user. This sounds a bit strange, but it is quite common do to this in headless scenario's. The user invokes an endpoint to get a JSON Web Token (JWT). Joost has written a [detailed blog post](https://joost.meijles.com/xc9-jwt/) about JWT and how it is used by the Commerce Engine. A JWT token can contain claims and in our case we've hadded a unique `anonymous customer id` to the claims. The client then uses the JWT token to authenticate with the API. This allows us to expose the current users' cart through `/cart/me` for example. This API call will read the `anonymous customer id` from the JWT tokens' claims and use that to retrieve the cart. To implement this we need the API gateway to be able to map `/cart/me` to the related Commerce Engine url `https://commerce:5000/api/Carts('{cartid}')?$expand=Lines`, read the `anonymous customer id` from the JWT tokens' claims and pass that `anonymous customer id` as the cart id in the downstream url.

As a result we need to be able to map upstream urls to downstream urls and move variables back and forth in different places. We were doing this mainly to learn in terms of development and didn't wanted to add additional complexity by using tooling like (and having to learn) [Nginx](https://www.nginx.com/) for the API gateway. There is a nice API gateway library that is implemented as middleware for asp.net called [Ocelot](https://github.com/ThreeMammals/Ocelot). You can use json configuration files to configure the routes. However, we wanted to map variables from headers to downstream urls and this didn't seem to be possible with Ocelot. Because this was only for development we coded the routes ourselves in a simple piece of asp.net middleware 