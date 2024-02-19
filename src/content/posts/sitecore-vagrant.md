---
title:  "A Sitecore Vagrant template"
date: 2016-05-15
author: jonnekats
comments: true
tags: [Sitecore, Vagrant, DSC]
description: "Sitecore (development) environments can be quite complex. Especially when you are using additional software like Sitecore Commerce Server or Coveo. Next to this certain dependencies can change, for example updating certain dependencies in this enviroment."
---
When working in a team, new team members should be able to easily get started without having to go through entire installation manuals to get their environment working. Also when a dependency changes, instead of all the team members having to upgrade this manually, this should be configured centrally. 

[Vagrant](https://www.vagrantup.com/) is a really nice tool that allows you to configure your development environment within your repository. When team members get the latest version of the repository they simply have to run "vagrant up" and the development environment will be started and provisioned with the correct dependencies. Vagrant allows you to provision the development enviroment with different providers like puppet, chef and salt. I chose to use Powershell DSC, because I've had good experiences in the past. 

[Jeremy Davis](https://jermdavis.wordpress.com/2015/10/12/development-environments-with-powershell-dsc-part-1/) has an excellent series of blog posts about provisioning Sitecore with DSC and this repository is heavily based on his work. 

You can find the repository [here](https://github.com/Jonne/SitecoreVagrantBox). 

