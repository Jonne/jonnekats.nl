---
title:  "How to test your commerce engine plugins"
date: 2019-12-18
author: jonnekats
comments: true
keywords: Sitecore 9, SXC9, commerce, JSS, sitecore, javascript services
image: ./images/test-commerce-engine.jpg
tags: [Sitecore]
description: "Writing tests is an important part of our work as software developers. Currently, there is no guidance on how to write tests for Sitecore Commerce Engine plugins and there is no straightforward way to do this. ASP.net core makes it possible to write in-memory integration tests. In this post I will share how you can use this to test your own Sitecore Commerce Engine plugins."
---
For a while I've been struggling to find a way to test custom Sitecore Commerce Engine plugins. One option would be to test against any custom blocks or pipelines directly and fake any dependencies such as other pipelines. This turns out to be not that trivial and there are other dependencies that you need to fake like the `CommerceContext`. As a result the tests don't look pretty and you are still just testing a small part of the functionality. 
With ASP.net core it got possible to run [integration tests](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-3.1) in-memory using a TestServer. At Aviva Solutions we have been successfully using this on other projects and I really wanted to be able to use this for Sitecore Commerce projects as well. What I wanted to do is to run the commerce engine in-memory and then swap out the database related pipeline blocks by blocks that persist in-memory, so I wouldn't need to setup a database.

![in-memory test server](/images/test-commerce-engine/overview.jpg)

The unit test would setup the commerce engine using the `TestServer` and swap out the SQL blocks with in-memory blocks. Then it would create an in-memory `HttpClient` using the `TestServer` and invoke the API like you would normally do using Postman. It would then assert by checking the API result or by checking what entities were added to the in-memory persistency blocks. It turned out running the commerce engine in-memory was not that easy, so I will share the challenges I needed to overcome.

## Setup Dependency Context
Normally when the engine spins up it will bootstrap all the plugins by dynamically searching for all the types that implement the `IConfigureSitecore` interface. It does this by using the .NET core `DependencyContext` class, which can be used to access all referenced assemblies. The commerce engine code that does this uses the default dependency context: `DependencyContext.Default`. However, `DependencyContext.Default` uses `Assembly.GetEntryAssembly()` to do this. A unit test project is based on a Class Library and in a Class Library the entry assembly is always null. Because of this, the in-memory commerce engine would not find any plugins. I've tried swapping out the code that used the `DependendyContext`, but this was not possible without modifying the default startup code, which I didn't want to do. I was able to fix this by applying the hack I found in [this article](https://dejanstojanovic.net/aspnet/2015/january/set-entry-assembly-in-unit-testing-methods/), which sets the entry assembly using reflection:

``` csharp
private static void SetEntryAssembly<T>()
{
    Assembly assembly = typeof(T).Assembly;

    var manager = new AppDomainManager();
    FieldInfo entryAssemblyfield =
        manager.GetType().GetField("m_entryAssembly", BindingFlags.Instance | BindingFlags.NonPublic);
    entryAssemblyfield.SetValue(manager, assembly);

    AppDomain domain = AppDomain.CurrentDomain;
    FieldInfo domainManagerField =
        domain.GetType().GetField("_domainManager", BindingFlags.Instance | BindingFlags.NonPublic);
    domainManagerField.SetValue(domain, manager);
}

// Point the entry assembly to the commerce engine project
SetEntryAssembly<Startup>();
```

This is not pretty, but it works. I will take this up with support, to see if they can make this more extensible, allowing you to hook into this mechanism from the tests.

## Authentication and authorization
The Sitecore Commerce Engine uses [Identity Server](https://identityserver.io/) for authentication and authorization, I've shared my notes on the details in an [earlier post](/2019/sitecore-commerce-security-explained/). A client can either authenticate by passing a certificate thumbprint in an http header, or by providing a bearer token which is handed out by Identity Server. At first the certificate thumbprint seemed like the easiest route, but in order to use that you will need to install a certificate on the machine on which the tests are running, which was a show stopper to me. I started to explore the bearer token route and stumbled on [this excellent stackoverflow answer](https://stackoverflow.com/a/40559393/1003817), which described how you can run an in-memory version of Identity server and use back channel handlers to have the Commerce Engine communicate with that in-memory version. To configure Identity Server I added the Identity Server nuget package to my test project and created a fake startup class:

``` csharp
public class IdentityServerStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        var builder = services.AddIdentityServer()
                              .AddTestUsers(new List<TestUser>
                              {
                                  new TestUser
                                  {
                                      Username = "sitecore\\admin",
                                      Password = "b",
                                      IsActive = true,
                                      SubjectId = "sitecore\\admin",
                                      Claims = new List<Claim>
                                      {
                                          new Claim("name", "admin"),
                                          new Claim("role", "sitecore\\Commerce Business User")
                                      }
                                  }
                              })
                              .AddInMemoryApiResources(new[]
                              {
                                  new ApiResource("EngineAPI", new[] { "name", "email", "role" })
                              })
                              .AddInMemoryClients(new[]
                              {
                                  new Client
                                  {
                                      ClientId = "client",

                                      // no interactive user, use the clientid/secret for authentication
                                      AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                                      // secret for authentication
                                      ClientSecrets =
                                      {
                                          new Secret("secret".Sha256())
                                      },

                                      // scopes that client has access to
                                      AllowedScopes = { "EngineAPI" }
                                  }
                              });
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseIdentityServer();
    }
}
```

This startup class simulates the normal Sitecore Identity Server behavior, by using the same scopes and roles. In my test I spin up a TestServer using this startup and request an access token using the `RequestPasswordTokenAsync` API:

``` csharp
var identityServerHostBuilder = new WebHostBuilder().UseStartup<IdentityServerStartup>();

var identityServer = new TestServer(identityServerHostBuilder);

HttpClient idClient = identityServer.CreateClient();

DiscoveryResponse disco = await idClient.GetDiscoveryDocumentAsync();

TokenResponse tokenResponse = await idClient.RequestPasswordTokenAsync(new PasswordTokenRequest
{
    Address = disco.TokenEndpoint,
    UserName = "sitecore\\admin",
    Password = "b",
    ClientId = "client",
    Scope = "EngineAPI",
    ClientSecret = "secret"
});

AccessToken = tokenResponse.AccessToken;
```

Now the Commerce Engine needs to be configured to use this in-memory Identity Server to validate the access token:

``` csharp
var identityServerHandler = identityServer.CreateHandler();

var commerceHostBuilder = new WebHostBuilder()
    .ConfigureServices(c => {
            c.Configure<IdentityServerAuthenticationOptions>("Bearer", options =>
            {
                options.Authority = "http://localhost";

                // IMPORTANT PART HERE
                options.JwtBackChannelHandler = identityServerHandler;
                options.IntrospectionDiscoveryHandler = identityServerHandler;
                options.IntrospectionBackChannelHandler = identityServerHandler;
            });
        })
    .UseStartup<Startup>();
```

And then add the access token to the client we use to communicate with the Commerce Engine:

``` csharp
var commerceServer = new TestServer(commerceHostBuilder);

HttpClient commerceClient = commerceServer.CreateClient();
commerceClient.SetBearerToken(AccessToken);
```

## Fake the database
The next thing we need to do is fake the database. This first thing the Commerce Engine tries to do is to check if the database version is compatible with the version of Sitecore Commerce. So we need to fake this command and return the right version:

``` csharp
public class DummyGetDatabaseVersionCommand : GetDatabaseVersionCommand
{
    public DummyGetDatabaseVersionCommand(IServiceProvider serviceProvider) : base(serviceProvider)
    {
    }

    public override Task<string> Process(CommerceContext commerceContext)
    {
        return Task.FromResult("9.1.0");
    }
}
```

And replace the normal `GetDatabaseVersionCommand` with the fake one:

``` csharp
new WebHostBuilder()
    .ConfigureServices...
    .ConfigureTestServices(services =>
    {
        services.AddTransient<GetDatabaseVersionCommand, DummyGetDatabaseVersionCommand>();        
    }.UseStartup<Startup>();
```

Now we want to replace the SQL pipeline blocks with in-memory ones. So far I needed to replace the following blocks:

* FindEntity
* FindEntitiesInList
* PersistEntity

Depending on your use case you may also need to replace content related block, because these will call out to sitecore XP. I needed to replace the following content related blocks:

* FindItemById
* GetItemsByPathBlock

And there a probably more that I haven't ran into yet. 

As an example this is the implemenation of my InMemory find entity block:

``` csharp
[PipelineDisplayName("InMemory.Persistence.FindEntityBlock")]
public class FindEntityBlock : PipelineBlock<FindEntityArgument, CommerceEntity, CommercePipelineExecutionContext>
{
    private readonly IStore store;

    public FindEntityBlock(IStore store)
    {
        this.store = store;
    }

    public override Task<CommerceEntity> Run(FindEntityArgument arg, CommercePipelineExecutionContext context)
    {
        var entity = store.Find(arg.EntityId);

        if (entity == null && arg.ShouldCreate)
        {
            entity = Activator.CreateInstance(arg.EntityType) as CommerceEntity;
        }

        return Task.FromResult(entity);
    }
}
```

Instead of going to the database it uses an in-memory store to find entities:

``` csharp
public class InMemoryStore : IStore
{
    public ConcurrentDictionary<string, CommerceEntity> Entities = new ConcurrentDictionary<string, CommerceEntity>();

    public void Add(CommerceEntity entity)
    {
        Entities.TryAdd(entity.Id, entity);
    }

    public CommerceEntity Find(string key)
    {
        CommerceEntity entity;

        if (Entities.TryGetValue(key, out entity))
        {
            return entity;
        }

        return null;
    }
}
```

This in-memory store can be resolved from the TestServer and can be used to add entities to setup the test data. All we have to do is register the custom block:

``` csharp
new WebHostBuilder()
    .ConfigureTestServices(services =>
    {
        var inMemoryStore = new InMemoryStore();
        services.AddSingleton<IStore>(inMemoryStore);

        services.Sitecore().Pipelines(config => config 
            .ConfigurePipeline<IFindEntityPipeline>(c =>
            {
                c.Clear();
                c.Add<FindEntityBlock>();
            }));
    }...
```

## Configure logging
It will require some disassembling of assemblies to figure out what is exactly needed to execute certain functionality using the tests. Sometimes it can also be useful to diagnose issues by looking at the Sitecore Commerce Engine logging. For this I followed the instruction in [this stackoverflow answer](https://stackoverflow.com/a/46172875/1003817) to make sure the Commerce Engine logging output ends up in the xUnit output window (I use xUnit for my tests). To change the log level or to enable pipeline logging you can override the configuration of the TestServer:

``` csharp
new WebHostBuilder()
    .ConfigureAppConfiguration((context, b) =>
    { 
        b.AddInMemoryCollection(new Dictionary<string, string>
        {
            { "Logging:LogLevel:Default", "Debug" },
            { "Logging:PipelineTraceLoggingEnabled", "true" }
        });
    });
```

> If you are using Resharper as a test runner and don't see all the logging you would have expected, make sure to Export the output of the test. It only shows a limited amount of the test ouput.

## Use test data builders
The code required to setup valid commerce entities, like the cart, can be quite elaborate. I recommended using the [test data builder pattern](https://wiki.c2.com/?TestDataBuilder) in order to keep the tests readable. This allows you to only show the code in the tests that is relevant for the functionality under test. 

## Result
This is how we are testing the functionality in our open source extensions for the Promotion Engine of Sitecore Commerce, which will be released shortly. I will update this post as soon as it is released, so you can have access to all the code. As an example, this is what the test currently look like:

``` csharp
[Fact]
public async void Should_qualify_when_operator_is_equal_and_fulfillment_method_is_same()
{
    var client = fixture.Factory.CreateClient();

    var promotion = await new PromotionBuilder()
                          .QualifiedBy(new CartFulfillmentConditionBuilder()
                              .Equal()
                              .WithValue("Standard"))
                          .BenefitBy(new CartSubtotalPercentOffActionBuilder()
                              .PercentOff("10"))
                          .Build(fixture.Factory);

    var cart = await new CartBuilder()
                     .WithFulfillment(new EntityReference("001", "Standard"))
                     .Build();

    fixture.Factory.AddEntities(cart, promotion);
    fixture.Factory.AddEntityToList(promotion, CommerceEntity.ListName<Promotion>());

    var resultCart = await client
        .GetJsonAsync<Cart>("api/Carts('Cart01')?$expand=Lines($expand=CartLineComponents($expand=ChildComponents)),Components");

    Assert.Contains(resultCart.Adjustments, c => c.AwardingBlock == nameof(CartSubtotalPercentOffAction));
}
```