---
title: Xpath queries with Fitnesse webtest
date: 2009-07-27
author: jonnekats
comments: true
tags: [Acceptance based testing, Fitnesse, webtest, xpath]
---
<p>As I wrote earlier, I’m using Fitnesse with the webtest driver to do acceptance based testing. Using webtest, it is really easy to write selenium based acceptance tests in a DSL way. However, the id’s that ASP.NET controls get assigned can get pretty ugly, especially when working with controls like the ASP.NET repeater. </p>  <p>When working with these controls, xpath can be really useful. To use xpath queries for looking up controls with webtest, you have to enclose the command that needs to use xpath with the following statements:</p>  <p>|Set locator lookup|false|</p>  <p>-- The statements that use xpath, for example:</p>  <p>|click|//input[Contains(@id, ‘ageSelector’)]|</p>  <p>|Set locator lookup|true|</p>  <p>By setting the locator lookup to false, it is possible to use xpath queries in stead of the normal lookup strategy used by Webtest (Ids, names or values).</p>  <p>When you are having trouble coming up with these xpath queries, then firebug really is your friend. It is possible to open up the firebug console and using a special command: $x(‘’) you can&#160; then debug your commands:</p>  <p><a href="http://jonnekats.files.wordpress.com/2009/07/image.png"><img style="border-bottom:0;border-left:0;display:inline;border-top:0;border-right:0;" title="image" border="0" alt="image" src="http://jonnekats.files.wordpress.com/2009/07/image_thumb.png" width="394" height="149" /></a></p>
