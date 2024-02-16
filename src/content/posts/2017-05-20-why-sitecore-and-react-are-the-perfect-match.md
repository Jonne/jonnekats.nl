---
title:  "Why React.JS & Sitecore are the perfect match"
date: 2017-05-20
author: jonnekats
comments: true
tags: [Sitecore, React]
---
Last year we started the development of Mercury, which is a generic E-commerce solution based on Sitecore & Commerce server. Learn more about Mercury [here](http://mercury-ecommerce.com). Over the years we have gained a lot of experience building E-commerce solutions. One of the things we wanted to do better with Mercury was to improve the User Experience, by using more client-side technology and by optimizing our usage of the browsers. This led us to find a client-side technology that would best fit our requirements.  These days the amount of JavaScript frameworks is overwhelming, but in the end we went for Facebook’s React. In this article you will learn why. 

<!--more-->

## React
React JS is a JavaScript framework for developing complex User Interfaces. It is developed by Facebook and has gotten a lot of publicity and momentum in the last couple of years. The first version of React was open sourced in 2013 and is currently being used by sites like Netflix, AirBNB, Twitter and Facebook itself. Why are more and more of these sites going for React?

### Reusable components
Unlike many JavaScript framework like Angular and Ember, React is focused only on the View part of [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). With MVC the model represents the data, the controller contains the logic like retrieving the data and the view transforms the model into something presentable, like HTML. Next to this, these frameworks offer all sorts of other facilities like Dependency Injection, services for communicating with the server, etc. 
React only knows components. Views are implemented with components and these components contains both the logic and the markup. In MVC frameworks the logic is separated from the markup. The controller contains the logic and the transformation from data to HTML is usually implemented by templates. According to the React philosophy the logic and the markup are too tightly coupled and should be kept together. Because the presentation logic is not spread out over multiple objects, React components greatly facilitate reuse. 

![Model View Controller](/assets/images/react-sitecore/mvc.png)

### Simple & fast
Performing updates is one of the reason User Interface code gets so complex. For example, deleting or adding a record to a list. The code needs to call the server to delete the record, but also remove or add the list from the UI. There is a lot of complex UI code for all these specialized scenario’s. Also, because the state in multiple places, you have to deal with state synchronization, which is complex and can cause bugs. It is a lot easier to just refresh the data from the server after a mutation and then re-render the whole list. React makes this especially easy by automatically re-rendering a component when its state changes. You only have to write the code that changes the state and only have to create the UI code that renders based on the state. Normally re-rendering the UI for every change would be expensive and cause performance problems, but React has a solution for this.

### Performance
DOM (Document Object Model) operations are slow. The DOM is the browser API that you can use to dynamically modify the HTML in the browser. Most of the (client-side) performance problems are caused by inefficient DOM operations. So, re-rendering the components on every little change would definitely cause performance problems. To solve this, React introduces a Virtual DOM. Instead of directly using the DOM, React components use this Virtual DOM. React has an event queue on the background that every n milliseconds checks the current Virtual DOM and compares it with the previous one. Based on the difference it will generate update (patch) statements that are executed against the real DOM, resulting in highly efficient DOM operations. This way, the developers don’t have to write complicated update operations, but still have super-fast JavaScript code. However, the Virtual DOM has another important advantage.

### Both on the client and on the server
React is “Isomorphic”. This is a new buzzword in the JavaScript world and means that the same code can be executed on the client and on the server. This unconventional method makes it possible to execute the JavaScript components on the server and send back the initial HTML to the browser. The advantage of this is that the HTML is better optimized for search engines. Modern search engines are getting better at parsing JavaScript, but some more than others and until then it’s still best practice to serve plain old HTML. Another advantage of serving this initial HTML is preventing the so called FOUC (Flash Of Unstyled Content). When most of the rendering is done in the browser, the server will first serve unstyled HTML. When the browser has received the HTML, it will interpret the JavaScript, which results in styled HTML. Especially on slower devices, like mobile devices, this can result in a flash of unstyled content.  By also doing the rendering on the server, it will directly serve styled HTML and no FOUC will occur.  

## Sitecore
Sitecore is the content management system on top of which Mercury is build. Read more about Sitecore [here]((http://www.sitecore.net)). To understand why we chose React, I will provide some background information about some of Sitecore’s technical characteristics. 

### Everything is an item
Sitecore is mostly data oriented. When you open Sitecore’s content editor, you will see a hierarchical tree of items. Items are based on templates and templates themselves are also items. Templates define the fields that make up an item. Next to the data, an item also contains presentation details.

### Presentation
The presentation details make up how an item will be presented in the UI. This consists of a layout and a set of renderings. The layout defined the global HTML of the page. This layout can contain placeholders. Placeholders are named locations within the HTML that are containers for the renderings. A rendering contains the presentation logic that transforms a piece of data to HTML. In figure 1 you can see a page with two renderings: FullPage & Wishlist. FullPage is placed in the body placeholder. FullPage itself also contains a placeholder, namely content in which the WishList rendering is placed.
When a rendering is added to the presentation details, it will optionally show a popup in which the rendering can be configured. So renderings are configurable and reusable.
Now we know a bit of how Sitecore works, let’s see why React is such a good fit for this.

![Sitecore](/assets/images/react-sitecore/sitecore.png)

## Sitecore <3 React
Sitecore renderings transform data to HTML. With MVC JavaScript frameworks this logic is spread out between the view and the controller, see Figure 2. The user interacts with the view, the view passes this on to the controller and the controller communicates with the server and transforms this into a model that is used by the view. Multiple components are involved in this operation. In case of a Sitecore rendering we already have the data and somehow we need to make this available in the JavaScript controller. With some hacks you will be able to get this working, but the two concepts just don’t seem to fit really well. 

React components however, seem to have the same responsibility as a Sitecore rendering: transforming data to HTML. And in case of React, this functionality is all grouped in a single component. Making it a lot easier to invoke the component from within our Sitecore rendering, with the data that is already available to us. As an example, in Mercury this looks like the following:

{% highlight javascript %}
@Html.React("Mercury.components.RecentlyViewedProducts", Model.Products)
{% endhighlight %}

Here we invoke a specific React component that is used to display a list of recently viewed products. The first argument is the name of the React component and the second is the list of recently viewed products that should be displayed. The react component only transforms the products into an HTML representation. In the case of Mercury, our Sitecore renderings are generally super thin and only invoke the corresponding React component.
Sitecore websites are usually front-facing websites, where search engine optimization and performance are super important. With the [ReactJS.NET](http://www.reactjs.net) open source project, the react components can easily be rendered on the Sitecore server. This greatly improves the initial performance of the website and fully optimizes it for search engines, despite its complex user interface.

## Blue skies
Altough the combination of Sitecore and React brings a lot of advantages to the table, there are some caveats. The learning curve of React is quite steep. It just needs a certain way of thinking, which can take some time to develop. Also, debugging Javascript on the server is very hard. Currently, there is no proper tooling for this. We develop and test the react components in the browser first, to minimize the amount of server debugging, which has worked really well for us. One thing to be aware of is the Experience editor. This is the Sitecore WYSIWYG editor and is really important for the SItecore experience. If the React components contain a lot of fields, they won’t be editable in the Experience editor. Most of the times this can be solved by keeping the React components themselves as small as possible. Another thing we do is we detect the editor in our MVC views and render additional fields in the experience editor, so that they can be changed by the content editor. 

## Conclusion
These days users expect more and more of the online user experience, thus usage of modern Javascript frameworks is inevitable. 
React components are perfectly suitable for implementing Sitecore renderings. Thanks to the possibility to also render the components on the server there is no negative impact on the SEO values of your site. Rendering the components on the server also prevents the so called Flash of Unstyled Content, making your site performant, even on slower mobile devices. React has a steep learning curve, so I would not recommend using It if there are no explicit requirements for an interactive UI. However, when you do need an interactive UI, I would say React is the way to go on the Sitecore platform.

