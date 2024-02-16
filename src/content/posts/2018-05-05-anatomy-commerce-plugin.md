---
title:  "The anatomy of a Sitecore Experience Commerce 9 plugin"
canonical: https://mercury-ecommerce.com/resources/the-anatomy-of-an-sitecore-experience-commerce-9-plugin
date: 2018-05-05
author: jonnekats
comments: true
keywords: Sitecore 9, SXC9, commerce, plugin
image: ./images/plugin-atonomy.jpg
tags: [Sitecore]
---
Look at the new Sitecore Experience Commerce 9 engine and you will find that the engine itself is just a shell: the core functionality is implemented as plugins. Extending the engine can be done by creating your own plugins.

<!--more-->

These all share the same concepts, which makes them easy to understand. It also makes it easy to find the code you are looking for. This article describes these concepts and how we use them at Mercury E-commerce.

The easiest way to learn about plugins is to open up a reflection tool (Like DotPeek) and look at the core plugins to see how they are implemented. You will find the following concepts.
 
## Commands
To my understanding, a command represents the unit of work for a certain action. The SXC9 documentation states that a command acts like the API in a task-driven API. So, for every action you can perform in the business tools, there is usually a corresponding command. Looking at the implementation in the core plugins, these commands are usually quite thin. They kick off a pipeline and wrap this invocation with activity tracking, often with a transaction. 
 
## Components
Components are used to extend existing entities. For example, the Availability plugin Sitecore.Commerce.Plugin.Availability adds an AvailabilityComponent to the SellableItem entity that is part of the catalog plugin. Components can be created by deriving from Component and are usually added to an entity by hooking into a pipeline. 
 
## Controllers
Controllers expose the functionality implemented in the plugins through a Service API. In other words, you will need to add a controller action if you want to expose your custom command through the REST API. These controllers are based on ASP.NET Core MVC controllers and ODATA. ODATA is a standard for making your RESTful API queryable. It also exposes metadata, which allows you to generate a typed proxy that you can use to communicate with it. 
 
## Entities
The SXC9 documentation states that: “A CommerceEntity is a core artifact designed to directly represent a business concept, which is stored as a single unit in a persistent storage.” Examples of entities include Cart, Sellable Item and Order. Entities are stored in the database and storage is treated as a document DB.

You therefore don’t need to manage any DB schema to store your entity. This is a huge step forward from the cumbersome schema management that had to be done with the old commerce server. 
 
## Models
If it concerns a POCO class and it’s not a component or an entity, it’s a model 😉. Models can be employed to reuse POCO classes between entities and components but can also be passed into and returned from commands.
 
## Pipelines
Pipelines do the heavy lifting in a plugin by making it possible to define extensible behavior. You can create your own pipelines and hook into pipelines defined in other plugins. The SXC9 pipeline mechanism is similar to the traditional Sitecore pipeline mechanism we all know. The traditional Sitecore pipelines are defined in XML configuration files.

With SXC9, however, these are defined in code. This allows compile-time checking of your pipeline configuration, which should enable you to find configuration errors earlier in the process. 

In general, the pipeline itself is just the definition of the pipeline and the actual implementation is done in one or more pipeline blocks. Pipeline blocks are similar to the pipeline processors we know from the traditional Sitecore pipeline mechanism. One benefit of the XML approach is that you can view the final pipeline using the showconfig.aspx tool.

Fortunately, the commerce engine also has an API call that you can invoke to get the runtime configuration of the registered pipelines. The result is in JSON and can be a bit hard to read. My colleague, Erwin Werkman, has created the excellent tool ‘Plumber’, which lets you visualize the pipeline configuration.  
 
## Policies
Policies are the Monads of the Commerce Engine because they are hard to understand, and everyone seems to have their own interpretation. The SXC9 documentation states: “A named, versionable and variable set of data that can be used as facts within behaviors to influence behavioral outcomes.” Don’t worry, I also had to re-read that sentence a couple of times. The best way to understand policies is to again use DotPeek and look at the policies defined in the core Commerce plugins.

For example, there is a RollupCartLinesPolicy, which is used to indicate that cart lines with the same product ID should be rolled up. In this case, it’s a global policy you can import using the environment JSON files in the bootstrap step. There are also local policies, for example: AvailabilityAlwaysPolicy. This policy gets added to sellable items and indicates that the sellable item has no inventory and is always available for purchase. So next to global policies, local policies can also be added to entities and components.
 
## Initialization
Besides these concepts, each plugin also contains initialization code, which ties everything together. This can be found in the ConfigureSitecore and ConfigureServiceApiBlock classes. The ConfigureSitecore class implements the IConfigureSitecore interface and automatically gets invoked by the engine during startup of the engine process. Don’t confuse this startup with the bootstrap and initialize REST calls that you perform to initialize the environment.
 
The ConfigureSitecore class usually (see Example 1) registers the plugin’s classes with the IOC container and initializes the pipeline configuration. It also adds the ConfigureServiceApiBlock to the IConfigureServiceApiPipeline pipeline. This block registers the custom entities, components and controller actions with the ODATA model, allowing them to be used by utilizing the REST Service API. 

``` csharp
    public class ConfigureSitecore : IConfigureSitecore
    {
        public void ConfigureServices(IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();
            services.RegisterAllPipelineBlocks(assembly);

            services.Sitecore().Pipelines(config => config

             .AddPipeline<ISamplePipeline, SamplePipeline>(
                    configure =>
                        {
                            configure.Add<SampleBlock>();
                        })

               .ConfigurePipeline<IConfigureServiceApiPipeline>(configure => configure.Add<ConfigureServiceApiBlock>()));

            services.RegisterAllCommands(assembly);
        }
    }
```

