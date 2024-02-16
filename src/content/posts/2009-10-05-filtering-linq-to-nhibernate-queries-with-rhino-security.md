---
title: Filtering Linq to Nhibernate queries with Rhino Security
date: 2009-10-05
author: jonnekats
comments: true
tags: [Design & Architecture, Rhino Security Linq-to-nhibernate]
---
<p><a href="http://go2.wordpress.com/?id=725X1342&amp;site=jonnekats.wordpress.com&amp;url=http%3A%2F%2Fayende.com%2FBlog%2Farchive%2F2008%2F01%2F22%2FRhino-Security-Overview-Part-I.aspx" target="_blank">Rhino Security</a> provides the ability to filter NHibernate queries based on permissions. To do this, an <strong>IAuthorizationService</strong> interface is provided, that can be used in the following way:</p>  <p>   <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:08911ac0-4fe2-42b8-af19-6c8331da5815" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">var criteria </span><span style="color:#000000;">=</span><span style="color:#000000;"> DetachedCriteria.For</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">Company</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
AuthorizationService.AddPermissionsToQuery(currentUser.Value, </span><span style="color:#800000;">"</span><span style="color:#800000;">/Company/View</span><span style="color:#800000;">"</span><span style="color:#000000;">, criteria);
</span><span style="color:#0000FF;">return</span><span style="color:#000000;"> criteria.GetExecutableCriteria(Session).List</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">Company</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>
</p>

<!--more-->

<p>This way, a user only gets to see the companies he has permissions for. The <strong>AddPermissionsToQuery</strong> method expects a user, an operation and an NHibernate <strong>ICiteria</strong> object. The <strong>ICriteria</strong> object is the NHibernate Criteria that needs to be extended with permissions. </p>

<p>This works really well, a nice optimized query is generated. However, when working with Linq-to-Nhibernate, you don’t have an <strong>ICriteria</strong> object, so how can we add the permissions to those queries? </p>

<p>To figure this out, I downloaded the latest sources for Linq-to-Nhibernate and discovered a <strong>QueryOptions</strong> property on the <strong>INhibernateQueryable</strong> interface, which returns a <strong>QueryOptions</strong> type. The <strong>QueryOptions</strong> type provides a <strong>RegisterCustomAction</strong> method, which takes a parameter of the the type <strong>Action&lt;ICriteria&gt;</strong>, this looks hopeful.</p>

<p>By doing some tests, I found out that internally Linq-to-Nhibernate translates linq queries into a Criteria object. The <strong>RegisterCustomAction</strong> method allows us to perform custom actions on this criteria object, making it possible to add our own restrictions, excellent! </p>

<p>Integrating Rhino Security with Linq-to-NHibernate then gets us the following code:</p>

<p></p>

<div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:73e9e6f2-a7f6-4a57-ac75-353a823a5d78" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">INHibernateQueryable</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;"> query </span><span style="color:#000000;">=</span><span style="color:#000000;"> Session.Linq</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
query.QueryOptions.RegisterCustomAction(x</span><span style="color:#000000;">=&gt;</span><span style="color:#000000;">
          AuthorizationService.AddPermissionsToQuery(user, </span><span style="color:#800000;">"</span><span style="color:#800000;">/User/View</span><span style="color:#800000;">"</span><span style="color:#000000;">, x));
</span><span style="color:#0000FF;">return</span><span style="color:#000000;"> query.ToList</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>This results in the same query as the one resulting from the DetachedCriteria scenario. So this way you can have <a href="http://go2.wordpress.com/?id=725X1342&amp;site=jonnekats.wordpress.com&amp;url=http%3A%2F%2Fayende.com%2FBlog%2Farchive%2F2008%2F01%2F22%2FRhino-Security-Overview-Part-I.aspx" target="_blank">Rhino Security</a> filter your queries based on permissions and still use Linq-to-Nhibernate. </p>
