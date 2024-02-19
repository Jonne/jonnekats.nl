---
title: Acceptance based testing tools
date: 2009-05-12
author: jonnekats
comments: true
tags: [Acceptance testing, Design & Architecture, Fitnesse, General, Selenium, StoryTeller, Twist]
---
<p>I really like the idea of having executable specifications. They can be used as requirements documentation and describe what your stakeholder expects from the software. Besides that, it is also useful as an indication of the progress being made by the development team. But what tools are there for automating acceptance tests?</p>  <p><strong>Fitnesse</strong></p>  <p>One of the most commonly used tools is <a href="http://www.fitnesse.org/" target="_blank">Fitnesse</a>. This is a wiki in which the tests can be described as tables. These tests can be described by the stakeholder and be mapped to test drivers that are created by the developers. A test driver is a mapping of the acceptance test to the code that needs to be tested, thus making the test executable.</p>  <p>There also is an extension to Fitnesse called <a href="http://www.fitnesse.info/webtest" target="_blank">Webtest</a>. This actually is a generic test driver for mapping Fitnesse tests to <a href="http://seleniumhq.org/" target="_blank">Selenium</a> scripts. If you are not familiar with Selenium, Selenium is a tool for testing web applications. For example, in c# a Selenium script looks like the following:</p>  <p>   <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:4e567043-72df-4287-9503-8bebc3ca1c40" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">ISelenium sel </span><span style="color:#000000;">=</span><span style="color:#000000;"> </span><span style="color:#0000FF;">new</span><span style="color:#000000;"> DefaultSelenium(
</span><span style="color:#800000;">"</span><span style="color:#800000;">localhost</span><span style="color:#800000;">"</span><span style="color:#000000;">, </span><span style="color:#800080;">4444</span><span style="color:#000000;">, </span><span style="color:#800000;">"</span><span style="color:#800000;">*firefox</span><span style="color:#800000;">"</span><span style="color:#000000;">, </span><span style="color:#800000;">"</span><span style="color:#800000;">http://www.google.com</span><span style="color:#800000;">"</span><span style="color:#000000;">);
sel.Start();
sel.Open(</span><span style="color:#800000;">"</span><span style="color:#800000;">http://www.google.com/</span><span style="color:#800000;">"</span><span style="color:#000000;">);
sel.Type(</span><span style="color:#800000;">"</span><span style="color:#800000;">q</span><span style="color:#800000;">"</span><span style="color:#000000;">, </span><span style="color:#800000;">"</span><span style="color:#800000;">FitNesse</span><span style="color:#800000;">"</span><span style="color:#000000;">);
sel.Click(</span><span style="color:#800000;">"</span><span style="color:#800000;">btnG</span><span style="color:#800000;">"</span><span style="color:#000000;">);
sel.WaitForPageToLoad(</span><span style="color:#800000;">"</span><span style="color:#800000;">3000</span><span style="color:#800000;">"</span><span style="color:#000000;">);</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>
</p>

<p>The webtest extension for Fitnesse allows you to write acceptance tests like the following:</p>

<h5><a href="http://jonnekats.files.wordpress.com/2009/05/image2.png" target="_blank"><img style="border-bottom:0;border-left:0;display:inline;border-top:0;border-right:0;" title="image" border="0" alt="image" src="http://jonnekats.files.wordpress.com/2009/05/image_thumb2.png" width="455" height="299" /></a> </h5>

<p>The test can then be executed from within the browser, which results in:</p>

<p><a href="http://jonnekats.files.wordpress.com/2009/05/image3.png" target="_blank"><img style="border-bottom:0;border-left:0;display:inline;border-top:0;border-right:0;" title="image" border="0" alt="image" src="http://jonnekats.files.wordpress.com/2009/05/image_thumb3.png" width="455" height="297" /></a> </p>

<p>So this is really cool, I really like the ability for the customer to open the tests via a browser and run the tests from the browser. But there are some things about Fitnesse that I don’t really like. As far as I know there is no source control integration and there is some friction in writing the test drivers. Writing the web tests is easy, but sometimes you need to test different functionality, which requires writing custom test drivers / fixtures. Some of these fixtures can become really cumbersome and complex. Besides that, I also think the tests still contain to much technical details. The organization of the tests (think test suites) and also the definition of the tests still contain technical details and are pretty fragile. The customer can easily break the tests. So overall, I really like the fitnesse approach, but there are some shortcomings. So are there any alternatives? </p>

<p><strong>StoryTeller</strong></p>

<p><a href="http://storyteller.tigris.org/" target="_blank">StoryTeller</a> is a replacement for Fitnesse. The first version of StoryTeller was based on the Fitnesse test engine, but the creator ran into a wall with the Fitnesse test engine. So he decided to reboot the StoryTeller project from scratch and created his own test engine. The progress looks promising, but the project is still very fresh. I’m eagerly following its progress, but to me it looks to immature to be used in a real live project at the moment. However, its creator <a href="http://codebetter.com/blogs/jeremy.miller/default.aspx" target="_blank">Jeremy Miller</a>, is a respectable member in the .NET community with an impressive track record, so I would definitely keep my eye on this one.</p>

<p><strong>Twist</strong></p>

<p>Thoughtworks offers a commercial product called <a href="http://studios.thoughtworks.com/twist-agile-test-automation" target="_blank">Twist</a>, which really is the way to go in my opinion. The user has it’s own user interface for defining the user stories in its purest form. The developers can then map these stories to executable tests from their own development environment. I really like the way this separates&#160; concerns. However the product uses Eclipse as a host IDE and the test drivers can only be written in java, which is not an option to me. Now what to use?</p>

<p><strong>What to use</strong></p>

<p>In my opinion, Twist provides the best experience to the end user and makes it really easy for developers to write the test drivers. If twist were to be integrated into visual studio and provided the ability to write test drivers in .NET, I would probably go for Twist. Unfortunately, this is not the case. </p>

<p>I’m also really interested in which way StoryTeller is going. Jeremy Miller just released a <a href="http://codebetter.com/blogs/jeremy.miller/archive/2009/05/11/sneek-peek-at-storyteller-i-e-my-fitnesse-killer-for-net.aspx" target="_blank">sneak preview</a>, but it does not provide any information about how the user will be defining the tests. I hope it will be anything like Twist. </p>

<p>For now, despite its shortcomings, I’m going to continue my work with Fitnesse, because it simply is the most widely used and mature tool out there.&#160; However, I’m keeping my eyes open for alternatives.&#160; </p>
