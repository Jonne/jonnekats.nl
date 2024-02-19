---
title: Rhino Mocks
date: 2007-10-27
author: jonnekats
comments: true
tags: [Test driven development, Uncategorized, Unit testing]
---
 

I'm becoming a big fan of test-driven development, yes, I actually write my tests before writing my code. It is a different mind-set and you really have to just do it a lot before really adopting to this mind-set.

When unittesting a class you often need <a href="http://en.wikipedia.org/wiki/Mock_object">mock objects</a> to test interaction with other classes. Until shortly, I used <a href="http://nmock.org/">NMock</a> to mock those other classes. I really like NMock, it has a nice API, which adheres to Martin Fowlers' <a href="http://www.martinfowler.com/bliki/FluentInterface.html">Fluent Interface</a>. But there has not been a lot of activity around the NMock project last year, it looks like development has been stopped. I also didn't really like the fact that you had to pass expected calls as string values, like: Expect.On(myMock).Method("MyMethod"). I didn't like this, because you can't make use of the compiler to check if the method exists and you can't use tools like <a href="http://www.jetbrains.com/resharper/">ReSharper</a> to implement the method, when doing test-driven development.

Lately another mocking framework's name turns up a lot, namely Rhino Mocks. It has been created by the same guy who did the NHibernate Query Analyzer. Anyways, I've been trying out Rhino Mock and it supports the same fluent interface as NMock. But the best thing is, that it supports setting expectations to real method names, like: Expect.On(myMock).Call(myMock.MyMethod). There also is a lot of activity around the project and using the mailing list will get you help frighteningly fast. <a href="http://www.ayende.com/projects/rhino-mocks.aspx">Check it out</a>.
