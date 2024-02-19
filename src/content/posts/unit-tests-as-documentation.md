---
title: Unit Tests as documentation
date: 2007-10-27
author: jonnekats
comments: true
tags: [Test driven development, Unit testing]
---
One of the advantages of doing test driven development &amp; unit testing is having the unit tests as documentation of the code. When you read this in the unit testing / TDD books, it is hard to imagine how this would be of use in practice.

As one of my favorite bloggers, <a href="http://codebetter.com/blogs/jeremy.miller/">Jeremy Miller</a>, already <a href="http://codebetter.com/blogs/jeremy.miller/archive/2006/02/20/138732.aspx">writes</a>, the <a href="http://www.nhibernate.org/">NHibernate</a> source is a really good example of using the tests as documentation. I think this is especially the case when developing frameworks or libraries. Because the code will always be used by developers, the best way for a developer to see how the code should be used is by looking at the unit tests as an example.

I experienced this myself a couple of days ago with the same code that Jeremy mentions. I also used the NHibernate EnumStringType to use an enum type that is represented in the database as a string column. This works great, but when I wanted to use the enum type in a HQL query, it didn't work the way I had expected:

 
<div class="wlWriterSmartContent" style="display:inline;float:none;margin:0;padding:0;">
<pre style="background-color:White;">
<div><span style="color:#000000;">            IQuery q </span><span style="color:#000000;">=</span><span style="color:#000000;"> s.CreateQuery(</span><span style="color:#000000;">"</span><span style="color:#000000;">from Order as order where order.State =:orderState</span><span style="color:#000000;">"</span><span style="color:#000000;">);
            q.SetEnum(</span><span style="color:#000000;">"</span><span style="color:#000000;">orderState</span><span style="color:#000000;">"</span><span style="color:#000000;">, OrderState.Open);
            IList results </span><span style="color:#000000;">=</span><span style="color:#000000;"> q.List();</span></div></pre>
</div>
The code above gave me a vague oracle exception. So i needed to figure out how to pass the parameter to the HQL query. I fired up the NHIbernate source to open the unit test for the EnumStringType:

<a href="http://jonnekats.files.wordpress.com/2007/10/windowslivewriterunittestsasdocumentation-b7f2image082.png"><img style="border-right:0;border-top:0;border-left:0;border-bottom:0;" src="http://jonnekats.files.wordpress.com/2007/10/windowslivewriterunittestsasdocumentation-b7f2image0-thumb42.png" border="0" alt="" width="545" height="249" /></a>

I then opened the test, which gave me the right code:

 
<div class="wlWriterSmartContent" style="display:inline;float:none;margin:0;padding:0;">
<pre style="background-color:White;">
<div><span style="color:#000000;">        [Test]
        </span><span style="color:#0000FF;">public</span><span style="color:#000000;"> </span><span style="color:#0000FF;">void</span><span style="color:#000000;"> ReadFromQuery()
        {
            ISession s </span><span style="color:#000000;">=</span><span style="color:#000000;"> OpenSession();

            IQuery q </span><span style="color:#000000;">=</span><span style="color:#000000;"> s.CreateQuery(</span><span style="color:#000000;">"</span><span style="color:#000000;">from EnumStringClass as esc where esc.EnumValue=:enumValue</span><span style="color:#000000;">"</span><span style="color:#000000;">);
            q.SetParameter(</span><span style="color:#000000;">"</span><span style="color:#000000;">enumValue</span><span style="color:#000000;">"</span><span style="color:#000000;">, SampleEnum.On, </span><span style="color:#0000FF;">new</span><span style="color:#000000;"> SampleEnumType());
            q.SetEnum(</span><span style="color:#000000;">"</span><span style="color:#000000;">enumValue</span><span style="color:#000000;">"</span><span style="color:#000000;">, SampleEnum.On);
            IList results </span><span style="color:#000000;">=</span><span style="color:#000000;"> q.List();

            Assert.AreEqual(</span><span style="color:#000000;">1</span><span style="color:#000000;">, results.Count, </span><span style="color:#000000;">"</span><span style="color:#000000;">only 1 was 'On'</span><span style="color:#000000;">"</span><span style="color:#000000;">);

            q.SetParameter(</span><span style="color:#000000;">"</span><span style="color:#000000;">enumValue</span><span style="color:#000000;">"</span><span style="color:#000000;">, SampleEnum.Off, </span><span style="color:#0000FF;">new</span><span style="color:#000000;"> SampleEnumType());
            results </span><span style="color:#000000;">=</span><span style="color:#000000;"> q.List();

            Assert.AreEqual(</span><span style="color:#000000;">0</span><span style="color:#000000;">, results.Count, </span><span style="color:#000000;">"</span><span style="color:#000000;">should not be any in the 'Off' status</span><span style="color:#000000;">"</span><span style="color:#000000;">);

            s.Close();

            </span><span style="color:#008000;">//</span><span style="color:#008000;"> it will also be possible to query based on a string value
            </span><span style="color:#008000;">//</span><span style="color:#008000;"> since that is what is in the db</span><span style="color:#008000;">
</span><span style="color:#000000;">            s </span><span style="color:#000000;">=</span><span style="color:#000000;"> OpenSession();

            q </span><span style="color:#000000;">=</span><span style="color:#000000;"> s.CreateQuery(</span><span style="color:#000000;">"</span><span style="color:#000000;">from EnumStringClass as esc where esc.EnumValue=:stringValue</span><span style="color:#000000;">"</span><span style="color:#000000;">);
            q.SetString(</span><span style="color:#000000;">"</span><span style="color:#000000;">stringValue</span><span style="color:#000000;">"</span><span style="color:#000000;">, </span><span style="color:#000000;">"</span><span style="color:#000000;">On</span><span style="color:#000000;">"</span><span style="color:#000000;">);
            results </span><span style="color:#000000;">=</span><span style="color:#000000;"> q.List();

            Assert.AreEqual(</span><span style="color:#000000;">1</span><span style="color:#000000;">, results.Count, </span><span style="color:#000000;">"</span><span style="color:#000000;">only 1 was 'On' string</span><span style="color:#000000;">"</span><span style="color:#000000;">);

            q.SetString(</span><span style="color:#000000;">"</span><span style="color:#000000;">stringValue</span><span style="color:#000000;">"</span><span style="color:#000000;">, </span><span style="color:#000000;">"</span><span style="color:#000000;">Off</span><span style="color:#000000;">"</span><span style="color:#000000;">);
            results </span><span style="color:#000000;">=</span><span style="color:#000000;"> q.List();

            Assert.AreEqual(</span><span style="color:#000000;">0</span><span style="color:#000000;">, results.Count, </span><span style="color:#000000;">"</span><span style="color:#000000;">should not be any in the 'Off' string</span><span style="color:#000000;">"</span><span style="color:#000000;">);

            s.Close();
        }</span></div></pre>
</div>
As Jeremy also mentions, the NHibernate documentation isn't as complete as we would have hoped, the EnumStringType isn't documented for example. But as the example above illustrates, these unit tests can be really helpful as technical documentation, especially when it concerns frameworks and libraries.
