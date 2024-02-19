---
title: Convention over configuration
date: 2009-08-04
author: jonnekats
comments: true
tags: [Code, Convention over configuration, Design & Architecture]
---
<p>Ruby on rails makes heavily use of the <a href="http://en.wikipedia.org/wiki/Convention_over_configuration" target="_blank">Convention over configuration</a> design paradigm. At the moment it is getting a hot topic in the .NET world too. If you are like me and are lazy and hate doing repetitive work, then you should really check it out, if you are not, you should check it out anyway. In my opinion, when properly applied, convention over configuration can save developers a lot of time and effort. </p>  <p>So what is convention over configuration? One of the best examples can be found in the <a href="http://fluentnhibernate.org/" target="_blank">Fluent Nhibernate project</a>. This is a project that facilitates configuring Nhibernate, without the use of those horrible XML mapping files. One feature of this project is <a href="http://wiki.fluentnhibernate.org/show/AutoMapping" target="_blank">Automapping</a>, which is convention over configuration in its purest form. I will just assume you are familiar with the Nhibernate mapping files, if not, you can read all about in the <a href="http://www.google.nl/url?sa=t&amp;source=web&amp;ct=res&amp;cd=3&amp;url=http%3A%2F%2Fnhforge.org%2Fwikis%2Freference2-0en%2Fnhibernate-2-0-reference-documentation.aspx&amp;ei=-5N4SqCWG8HZ-QafjeHSBQ&amp;usg=AFQjCNFj0NVGMdg-YEjx9Ia3Jh2VfW_bVg&amp;sig2=WONilrfqLkOV1Im0c3J9xw" target="_blank">Nhibernate documentation</a>.</p>  <p>Let’s say you have a domain entity Customer:</p>  <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:7b7d9483-fcbb-4e5e-81d2-b2b21c698254" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#0000FF;">public</span><span style="color:#000000;"> </span><span style="color:#0000FF;">class</span><span style="color:#000000;"> Customer
{
    </span><span style="color:#0000FF;">public</span><span style="color:#000000;"> </span><span style="color:#0000FF;">virtual</span><span style="color:#000000;"> </span><span style="color:#0000FF;">int</span><span style="color:#000000;"> Id { </span><span style="color:#0000FF;">get</span><span style="color:#000000;">; </span><span style="color:#0000FF;">private</span><span style="color:#000000;"> </span><span style="color:#0000FF;">set</span><span style="color:#000000;">; }
    </span><span style="color:#0000FF;">public</span><span style="color:#000000;"> </span><span style="color:#0000FF;">virtual</span><span style="color:#000000;"> </span><span style="color:#0000FF;">string</span><span style="color:#000000;"> Name { </span><span style="color:#0000FF;">get</span><span style="color:#000000;">; </span><span style="color:#0000FF;">set</span><span style="color:#000000;">; }
}</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p>&#160;</p>

<p>And you would have your corresponding Nhibernate mapping file as we know it all too well:</p>

<p></p>

<div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:ef1e47d4-bbf6-44c1-9758-00d80d136833" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">&lt;?</span><span style="color:#000000;">xml version</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">1.0</span><span style="color:#800000;">"</span><span style="color:#000000;"> encoding</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">utf-8</span><span style="color:#800000;">"</span><span style="color:#000000;"> </span><span style="color:#000000;">?&gt;</span><span style="color:#000000;">
</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">hibernate</span><span style="color:#000000;">-</span><span style="color:#000000;">mapping xmlns</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">urn:nhibernate-mapping-2.0</span><span style="color:#800000;">"</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">
  </span><span style="color:#000000;">&lt;</span><span style="color:#0000FF;">class</span><span style="color:#000000;"> name</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">NHibernate.Examples.Customer, NHibernate.Examples</span><span style="color:#800000;">"</span><span style="color:#000000;"> table</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Customer</span><span style="color:#800000;">"</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">
    </span><span style="color:#000000;">&lt;</span><span style="color:#000000;">id name</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Id</span><span style="color:#800000;">"</span><span style="color:#000000;"> column</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Id</span><span style="color:#800000;">"</span><span style="color:#000000;"> type</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Int</span><span style="color:#800000;">"</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">
      </span><span style="color:#000000;">&lt;</span><span style="color:#000000;">generator </span><span style="color:#0000FF;">class</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">identity</span><span style="color:#800000;">"</span><span style="color:#000000;"> </span><span style="color:#000000;">/&gt;</span><span style="color:#000000;">
    </span><span style="color:#000000;">&lt;/</span><span style="color:#000000;">id</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">
    </span><span style="color:#000000;">&lt;</span><span style="color:#000000;">property name</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Name</span><span style="color:#800000;">"</span><span style="color:#000000;"> column</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">Name</span><span style="color:#800000;">"</span><span style="color:#000000;"> type</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">String</span><span style="color:#800000;">"</span><span style="color:#000000;"> length</span><span style="color:#000000;">=</span><span style="color:#800000;">"</span><span style="color:#800000;">40</span><span style="color:#800000;">"</span><span style="color:#000000;">/&gt;</span><span style="color:#000000;">
  </span><span style="color:#000000;">&lt;/</span><span style="color:#0000FF;">class</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">
</span><span style="color:#000000;">&lt;/</span><span style="color:#000000;">hibernate</span><span style="color:#000000;">-</span><span style="color:#000000;">mapping</span><span style="color:#000000;">&gt;</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>&#160;</p>

<p></p>

<p>I used to have mapping files like these all over the place. Writing these mapping files gets really boring and mistakes are easily made and hard to debug. The Automapping feature makes all of this a thing of the past. With Automapping it is possible to provide, for example a namespace, and automatically map all the entities in that namespace to a database. This mapping takes place based on conventions. One such convention can be that an entity’s property with the name Id always maps on an identity field named Id in the database. Or that a many to one relationship always maps on to a certain column. For example Order –&gt; Customer automatically maps to the column Customer_id in the Order table. With the fluent nhibernate automapping it is also really easy to overwrite the default conventions by providing your own. Off course, this is not very useful when mapping to a legacy database, but in most of the green field Nhibernate projects it can be applied successfully. So in this case, in stead of configuring all of the mappings in XML files, we have certain conventions that allow Fluent nhibernate to assume entities are mapped to the database in the same consistent way.</p>

<p>&#160;</p>

<p>Another good example of convention over configuration is the registration of services with an Inversion of Control container. In a lot of TDD based systems, there are loads of interfaces that only have one implementation. So why have to register all of these services one at the time? Why not just say to the container automap all services that fulfill a certain requirement, like being in a namespace or deriving from a certain base interface. Structuremap has this functionality out of the box. Unity doesn’t have this yet, but <a href="http://www.ctrl-shift-b.com" target="_blank">Derek Greer</a> has created a Unity extensions to provide this, which he describes in this <a href="http://www.ctrl-shift-b.com/2009/06/convention-based-registration-extension.html" target="_blank">blog post</a>.</p>

<p>So instead of doing this: </p>

<p></p>

<div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:a0af7cbe-6dd7-45fe-975b-3f191ab95c58" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ICategoryRepository, CategoryRepository</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ICustomerRepository, CustomerRepository</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IOrderRepository, OrderRepository</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>It allows you to do stuff like this:</p>

<div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:8a95f4b0-d65e-4b4a-9d5c-6041c2eef799" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">Container
    .AddNewExtension</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ConventionExtension</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">()
    .Using</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IConventionExtension</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">()
    .Configure(x </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;">
                  {
                     x.Conventions.Add</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ImplementationConvention</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IRepository</span><span style="color:#000000;">&gt;&gt;</span><span style="color:#000000;">();
                     x.Assemblies.Add(Assembly.GetExecutingAssembly());
                   })
    .Register();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>Which automatically maps all the services deriving from IRepository in the executing assembly. This can save you a lot of work, personally I always forget to add the service I made to the container. However, it also involves a lot of black magic. The wiring gets done under the hood, so how you debug a problem when something goes wrong? Well you will need some diagnostics. For example, it is possible to have Fluent Nhibernate spit out all the mapping xml file that are used under the hood, which makes it easy to debug. So when diagnostics are provided, convention over configuration can be really useful and is a welcome addition to my bag of tricks.</p>
