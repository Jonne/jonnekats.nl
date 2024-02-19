---
title: State based Domain Entities (State pattern)
date: 2008-10-20
author: jonnekats
comments: true
tags: [Domain driven design]
---
This post is actually just about bringing the state pattern into practice. At my current project, we have some entities that are based on state, which are forcing us to use some not so elegant mechanisms for change their state. I will try to explain this with the following example:

<img src="http://jonnekats.files.wordpress.com/2008/10/102008-1931-statebasedd11.png" alt="" />

So there is a <strong>Product</strong> that can either be a <strong>PlannedProduct</strong> or a <strong>ManufactoredProduct</strong>. Now let's say our business domain tells us that there is some transition from a <strong>PlannedProduct</strong> to a <strong>ManufactoredProduct</strong>. With the above model you would have to convert the entities, because you cannot just change the inheritance type at runtime. In case you are persisting the domain, you would also have to write code to delete the old entity and save the newly created entity, using NHibernate this code would probably look like the following:

ManufactoredProduct manufactoredProduct = ProductConverter.Convert&lt; ManufactoredProduct&gt;(plannedProduct);

NHibernateSession.Delete(plannedProduct);

NHibernateSession.Flush();

NHibernateSession.SaveOrUpdate(manufactoredProduct);

NHibernateSession.Flush();

The double flush is needed if you have some unique constraints on the product fields. As you would probably agree, not the most elegant solution. Here comes the state pattern. <a href="http://en.wikipedia.org/wiki/State_pattern">Wikipedia</a> mentions that the State pattern provides a clean way for an object to change its type at runtime. Here is the refactored model:

<img src="http://jonnekats.files.wordpress.com/2008/10/102008-1931-statebasedd21.png" alt="" />

 

Now if we would want to change the product type we would just have to assign a new <strong>ManufactoredProductState</strong> to its State property, no conversion needed. Though, we would still have to delete the previous <strong>PlannedProductState</strong> entity, but without the strange double flush constructions.

So to conclude, now burning water here. You've probably all been using the state pattern this way for ages. For me it was the first time using the state pattern in this way, before I've used it solely for separating behavior based on state. I thought it was a nice improvement to our code and wanted to write it down as a reference.
