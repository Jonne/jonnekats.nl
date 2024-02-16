---
title:  "Issue deploying xConnect SQL shards on multi-machine setup"
date: 2017-12-27
author: jonnekats
comments: true
keywords: Sitecore 9, Docker, SIF, xConnect, SQL, Shard, Connection error
tags: [Sitecore]
---
When I was [trying](../dockerizing-sitecore-9-xp0) to get the Sitecore 9 xp0 topology working, I ran into an issue with the xConnect SQL shard deployment. I installed everything using the SIF scripts and it seemed to have installed fine, but I found connection errors in the xConnect logs:

<!--more-->

> A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections.

I checked the connection strings in the config files for xConnect and everything seemed fine. A better look at the stack trace showed me this error was originating from the Azure ShardMapManager code that xConnect used to manage the SQL shards. This ShardMapManager uses information from a table (ShardsGlobal) to connect to the right shard databases and opening this table showed me that the server name was set to `localhost`. However, SQL server was installed on another machine. 

Because I was installing everything on seperated machines, I also ran the SIF scripts that created the shards on the SQL machine. These SIF scripts use a proprietary tool called `Sitecore.Xdb.Collection.Database.SqlShardingDeploymentTool.exe` and the connection settings you use with this tool are implicitely used when connecting to the shards from xConnect. So bottom line: Make sure that the connection settings you pass into the `Sitecore.Xdb.Collection.Database.SqlShardingDeploymentTool.exe` tool are the same ones that you will use when connecting from xConnect. 

I was using the `microsoft/mssql-server-windows-express` docker image for the SQL database and you can only use windows authentication in the Build phase of this image. To work around this, I manually updated the connection settings in the shard tables after running the `Sitecore.Xdb.Collection.Database.SqlShardingDeploymentTool.exe` tool:

``` SQL
UPDATE [xp0_Xdb.Collection.ShardMapManager].[__ShardManagement].[ShardsGlobal] SET ServerName = '<SERVERNAME>'
```

Besides this, don't forget to make the user (That you are using in the connection string) db\_owner of the sharding databases. If not, you will get  errors in the xConnect logs about SQL not being able to get information about the original db\_owner.
