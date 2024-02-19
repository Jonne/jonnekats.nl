---
title: Rhino security with Unity
date: 2009-09-15
author: jonnekats
comments: true
tags: [Code, Design & Architecture, Domain driven design, Rhino Security, Unity]
---
If you are using NHibernate and need an integrated authorization framework, then have a look at <a href="http://ayende.com/Blog/archive/2008/01/22/Rhino-Security-Overview-Part-I.aspx" target="_blank">Rhino Security</a>. Rhino Security is a security framework developed by <a href="http://ayende.com/" target="_blank">Ayende</a>, creator of <a href="http://ayende.com/projects/rhino-mocks.aspx" target="_blank">Rhino Mocks</a> and the <a href="http://www.nhprof.com/" target="_blank">Nhibernate Profiler</a>, among other things.&#160; 

Rhino Security automatically adds entities and services to your application for managing security. It provides the ability to decorate your own User entity with an IUser interface, making it suitable for use in authorization. There is the notion of user groups (Roles), operations, entities, entity groups and permissions. Authorization is done based on both operation and entity level. So you can define permissions for users and usergroups on operations, entities and even groups of entities. </p>  <p>It is amazingly flexible and even adds the ability to filter queries based on permissions. So for example, as a marketing manager, you only get to see the products you have permissions for. <p>For more information on how to use Rhino Security checkout:</p>  <p>- Ayendes blog: <a title="http://ayende.com/Blog/category/548.aspx" href="http://ayende.com/Blog/category/548.aspx">http://ayende.com/Blog/category/548.aspx</a></p>  <p>- Bart Reyserhove’s blog: <a title="http://bartreyserhove.blogspot.com/search/label/rhino%20security" href="http://bartreyserhove.blogspot.com/search/label/rhino%20security">http://bartreyserhove.blogspot.com/search/label/rhino%20security</a></p>  <p>Rhino security used to have dependencies on Castle Windsor and Rhino Tools, making it quite hard to use if you had already chosen another IOC container, like Unity for example. Luckily, in the latest version, Ayende has eliminated those dependencies and swapped them out for the <a href="http://www.codeplex.com/CommonServiceLocator" target="_blank">Common Service Locator</a>. </p>  <p><strong>Common Service Locator</strong></p>  <p>For those of you who are unfamiliar with the Common Service Locator, the Common Service Locator is a shared interface for IOC containers available on <a href="http://www.codeplex.com/CommonServiceLocator" target="_blank">codeplex</a>, which abstracts the specifics of IOC containers. The goal of this generic interface is to have frameworks only rely on this generic interface, making it possible for the users of the framework to plug in the IOC container they are using. So, because Rhino Security is now making use of this Common Service Locator, it is now possible to have it use our own Unity container, this way having better integration.</p>  <p>So, how do you use Rhino Security with Unity?</p>  <p><strong>Using Rhino Security with Unity</strong></p>  <p>First, get the latest version of Rhino Security from Github:</p>  <p><a title="http://github.com/ayende/rhino-security" href="http://github.com/ayende/rhino-security">http://github.com/ayende/rhino-security</a></p>  <p>Next, get the latest version of the Unity adapter for the Common Service Locator from codeplex:</p>  <p><a title="http://www.codeplex.com/CommonServiceLocator" href="http://www.codeplex.com/CommonServiceLocator">http://www.codeplex.com/CommonServiceLocator</a></p>  <p>Now what I did is write a Unity container extensions to provide the Rhino Security integration:</p>  <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:d02c05f5-428a-4316-8835-56c77a8bde99" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">    </span><span style="color:#808080;">///</span><span style="color:#008000;"> </span><span style="color:#808080;">&lt;summary&gt;</span><span style="color:#008000;">
    </span><span style="color:#808080;">///</span><span style="color:#008000;"> Custom extension that sets up the dependencies needed to use Rhino Security.
    </span><span style="color:#808080;">///</span><span style="color:#008000;"> </span><span style="color:#808080;">&lt;/summary&gt;</span><span style="color:#808080;">
</span><span style="color:#000000;">    </span><span style="color:#0000FF;">public</span><span style="color:#000000;"> </span><span style="color:#0000FF;">class</span><span style="color:#000000;"> UnityRhinoSecurityExtension : UnityContainerExtension
    {
        </span><span style="color:#0000FF;">protected</span><span style="color:#000000;"> </span><span style="color:#0000FF;">override</span><span style="color:#000000;"> </span><span style="color:#0000FF;">void</span><span style="color:#000000;"> Initialize()
        {
            </span><span style="color:#008000;">//</span><span style="color:#008000;"> Setup dependencies needed by Rhino Security.</span><span style="color:#008000;">
</span><span style="color:#000000;">            Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IAuthorizationService, AuthorizationService</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
            Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IAuthorizationRepository, AuthorizationRepository</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
            Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IPermissionsBuilderService, PermissionsBuilderService</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();
            Container.RegisterType</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IPermissionsService, PermissionsService</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();

            </span><span style="color:#008000;">//</span><span style="color:#008000;"> Make our Nhibernate Session available to Rhino Security.</span><span style="color:#008000;">
</span><span style="color:#000000;">            Container.AddNewExtension</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">StaticFactoryExtension</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();

            Container.Configure</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">IStaticFactoryConfiguration</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">()
                .RegisterFactory</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ISession</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">(GetSession);

            </span><span style="color:#008000;">//</span><span style="color:#008000;"> Indicate that Rhino Security should use our Unity container for looking up dependencies.</span><span style="color:#008000;">
</span><span style="color:#000000;">            ServiceLocator.SetLocatorProvider(() </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> </span><span style="color:#0000FF;">new</span><span style="color:#000000;"> UnityServiceLocator(Container));
        }

        </span><span style="color:#0000FF;">private</span><span style="color:#000000;"> </span><span style="color:#0000FF;">static</span><span style="color:#000000;"> ISession GetSession(IUnityContainer container)
        {
            </span><span style="color:#0000FF;">return</span><span style="color:#000000;"> container.Resolve</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">ISessionManager</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">().Session;
        }
    }</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>In the GetSession method you have to return the instance of the Nhibernate Session you are using. After this, add the extension to your container:</p>

<p>
  <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:59df4b20-d540-45c5-8646-3cc00580930f" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">container.AddNewExtension</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">UnityRhinoSecurityExtension</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>
</p>

<p>The following line in the extension configures the Common Service Locator to use the Unity adapter and passes the instance of the container we are using:</p>

<p>
  <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:e00e9745-1da6-42ce-9079-5007effcc833" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">ServiceLocator.SetLocatorProvider(() </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> </span><span style="color:#0000FF;">new</span><span style="color:#000000;"> UnityServiceLocator(Container));</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>
</p>

<p>Now the only thing left to do, is to give Rhino Security access to our Nhibernate configuration, so It can add the mappings for its own entities. We are using Fluent Nhibernate, which makes our configuration look like the following:</p>

<div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:3a477864-5e95-4faa-8767-2a6f76149bbf" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#0000FF;">return</span><span style="color:#000000;"> Fluently.Configure()
    .Database(MsSqlConfiguration.MsSql2005.
                  ConnectionString(
                  x </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> x.FromConnectionStringWithKey(ConnectionStringConfigKey))
                  .ProxyFactoryFactory(</span><span style="color:#0000FF;">typeof</span><span style="color:#000000;"> (ProxyFactoryFactory).AssemblyQualifiedName))
    .Mappings(m </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> m.AutoMappings.Add(AutoPersistenceModel.MapEntitiesFromAssemblyOf</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">()))
    .ExposeConfiguration(cfg </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> Security.Configure</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">(cfg, SecurityTableStructure.Prefix))
    .BuildSessionFactory();</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>

<p></p>

<p>The following line exposes our configuration to Rhino Security:</p>

<p>
  <div style="display:inline;float:none;margin:0;padding:0;" id="scid:57F11A72-B0E5-49c7-9094-E3A15BD5B5E6:c6394255-134a-4b7d-a8f9-24c138c5f2e2" class="wlWriterEditableSmartContent"><pre style="background-color:#FFFFFF;white-space:pre-wrap;overflow:auto;"><span style="color:#000000;">.ExposeConfiguration(cfg </span><span style="color:#000000;">=&gt;</span><span style="color:#000000;"> Security.Configure</span><span style="color:#000000;">&lt;</span><span style="color:#000000;">User</span><span style="color:#000000;">&gt;</span><span style="color:#000000;">(cfg, SecurityTableStructure.Prefix))</span></pre><!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com --></div>
</p>

<p>Now when you generate the database schema from you Nhibernate configuration, you are able to use the Rhino Security services to implement authorization in you application.</p>
