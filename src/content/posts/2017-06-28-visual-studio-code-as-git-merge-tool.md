---
title:  "How to configure Visual Studio Code as your GIT merge tool"
description: Visual Studio Code is awesome and recently it has gotten build in support for merging.
date: 2017-06-28
author: jonnekats
comments: true
tags: [General]
---
I'm a big fan of Visual Studio Code. It's fast, extensible and it even runs cross platform. Recently it
has gotten build in support for merging. Before, I was using Diffmerge as my merge tool of choice, but I 
find the 3-way merge view with the remote, base and local files a bit confusing. Visual Studio Code just 
shows one file and shows the differences inline:

<!--more-->

![](/assets/images/codemerge.png)

Configuring Visual Studio Code as your GIT merge tool can be a bit confusing. Code already had the ability
to do a DIFF and the information on how to configure it seems a bit spread out and outdated.

After multiple attempts I was able to get it working using the following config, hope this helps someone:

Run `git config --global -e` to edit your global GIT config and add the following: 

{% highlight ini %}
[diff]
    tool = default-difftool
[difftool "default-difftool"]
    cmd = code --wait --diff $LOCAL $REMOTE
[merge]
    tool = default-mergetool
[mergetool "default-mergetool"]
    cmd = code --wait $MERGED
{% endhighlight %}