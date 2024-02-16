---
title:  "Dockerizing Sitecore 9 XP0"
date: 2017-12-17
author: jonnekats
comments: true
keywords: Sitecore 9, Docker, Commerce, Sitecore
tags: [Sitecore]
---
Sitecore eXperience Commerce 9 is expected to be released in Q1 of 2018. This new version will contain no more COM+ components and is build on .NET core. This means that we should be able to run it on Docker! To get ready for that I wanted to see if I could get the Sitecore 9 xp0 topology running on Docker. Per Manniche Bering, who knows a lot more about Docker than I do, already has Sitecore 9 XM1 running on Docker in [this repository](https://github.com/pbering/sitecore-nine-docker). So I wanted to see if I could use his work and add the services needed for xp0. Currently, I got most of it running on docker and will share the repository shortly. For now, I wanted to share some lessons I learned during the process and hopefully safe people some time. As a disclaimer, I am by no means a Docker or infrastructure expert. Any feedback is more than welcome! 

<!--more-->

# Certificates
One of the biggest challenges with the Sitecore 9 install is the required SSL communication. The example SIF script is based on installing everyting on the same machine and if you want to distribute the different services over different machines, you will need to distribute the SSL certificate. To generate the self signed cetifiate, make sure you don't use the default provider. For some reason, the default provider will create a certificate which's private key is not exportable. Later in the process, this will create problems if you try to use the certificate. The following code worked for me:

``` powershell
$cert = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname $dnsName -KeyExportPolicy Exportable -Provider 'Microsoft Enhanced RSA and AES Cryptographic Provider'

$pwd = ConvertTo-SecureString -String $secret -Force -AsPlainText

Export-PfxCertificate -cert $cert -FilePath $file -Password $pwd
```
You will need a certificate for xConnect and one for SOLR. Now that you have the certificates you will need to install it in the different images. I used the following code to install the certificates:

``` powershell
$pwd = ConvertTo-SecureString -String $secret -Force -AsPlainText; `
Import-PfxCertificate -FilePath $certificateFile -CertStoreLocation Cert:\$storeLocation\$storeName -Password $pwd
```

When you install the certificate into `LocalMachine\My`, you also need to install it into `LocalMachine\Root`. If not the certificate will be untrusted. The code that is used by Sitecore cannot find the certificate if it is not trusted and will cause the following exception: 'certificate not found'. There is a config setting that you can configure on the connection string that is used for the certificate: `AllowInvalidClientCertificates`, but easiest is just to add the certificate to the Root store.

I got SSL working by installing the certificates into the stores depicted by the following table:

| Container              | SOLR Certificate | xConnect Certificate |
| ---------------------- | ---------------- | -------------------- |
| SOLR                   | My / Root        |                      |
| xConnect               | Root             | My / Root            |
| Sitecore               | Root             | My / Root            |

The SOLR certificate also needed to be configured in SOLR, Jeremy Davis has an awesome [blog post] (Https://jermdavis.wordpress.com/2017/10/30/low-effort-solr-installs/) on this, which worked for me.

# Solr
Getting Solr to run on docker can be a bit of a challenge. The official Solr docker image runs on linux and as far as I know Docker on Windows does not yet support running Linux and Windows containers side by side. There is a [Solr docker image](https://github.com/kevinobee/docker-solr) for windows by Kevin Obee, however it is based on Solr 6.6.1. So, what I did was copy Kevin Obee's image and change it to use the 6.6.2 download. 

XConnect and Sitecore create SOLR cores as part of the installation, so I wanted to create those cores in the solr image:

``` docker
RUN Install-SitecoreConfiguration -Path "C:\\Files\\xconnect-solr.json" `
    -SolrUrl "https://solr:8983/solr" `
    -SolrRoot "c:\\solr\\solr-6.6.2" `
    -SolrService "Solr-6.6.2" `
    -CorePrefix "xp0"

RUN Install-SitecoreConfiguration -Path "C:\\Files\\sitecore-solr.json" `
    -SolrUrl "https://solr:8983/solr" `
    -SolrRoot "c:\\solr\\solr-6.6.2" `
    -SolrService "Solr-6.6.2" `
    -CorePrefix "Sitecore"
```
However, SOLR needs to be running in order for these scripts to work. The SOLR image starts SOLR as the entry point, so SOLR itself isn't running yet during build. The first thing I tried is to just temporarily start SOLR during build by executing the normale solr cmd file without the -f. This caused docker to wait for that command to finish, even when it was finished. To get around this I installed solr as a windows service using NSSM, Again I used Jeremy Davis's [blog post](https://jermdavis.wordpress.com/2017/10/30/low-effort-solr-installs/) as inspiration. The only I had to add to install the SOLR service, was pass in the JAVA_HOME:

```
RUN /nssm/win64/nssm.exe install "Solr-6.6.2" "/solr/solr-6.6.2/bin/solr.cmd" "start" "-f" "-p 8983"
RUN /nssm/win64/nssm.exe set "Solr-6.6.2" AppEnvironmentExtra JAVA_HOME=C:\java\jre
```

Without the JAVA_HOME the service would be stuck in pause, without any useful logging.

So now SOLR is running in the build phase of the image and we are able to install the xConnect and Sitecore SOLR cores. I changed the entrypoint of the Docker file to monitor the service:

``` docker
ENTRYPOINT C:\ServiceMonitor.exe $Env:SERVICE_NAME
```

# Using the SIF packages
The SIF scripts that are included with the Sitecore installation are useful, but you need to alter them a bit in order to create docker images. Fortunately, Per Manniche Bering has [already figured out](https://github.com/pbering/sitecore-nine-docker/blob/master/xm1/cm/Dockerfile) how to skip tasks and how to exclude database operations from the SIF scripts. So, I did exactly the same to install xConnect and Sitecore. 

# Other issues
Although, Sitecore was running, I saw a lot of SQL errors in the log saying: `Could not obtain information about Windows NT group/user 'DOMAIN\user'`. Because the database are created by that user, it is also the db_owner of those databases. Changing the db_owner to `sa` fixes this issue. So after I ran the dacpac files in the docker file I change the db_owner to sa:

``` powershell
 sqlcmd -d $name -Q 'EXEC sp_changedbowner ''sa'''
``` 

Most of it is working now, I will spend some more time this week on making sure everything works and will share my work on Github shortly. 