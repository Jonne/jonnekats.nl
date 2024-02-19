import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: "vitesse-light"
    }
  },
  shikiConfig: {
    wrap: true,
    skipInline: false,
    drafts: true
  },
  site: 'https://www.jonnekats.nl',
  integrations: [tailwind(), sitemap(), mdx(), partytown({
    // Adds dataLayer.push as a forwarding-event.
    config: {
      forward: ["dataLayer.push"],
    },
  }),],
  redirects: {
    '/2007/[...slug]': '/posts/[...slug]',
    '/2008/[...slug]': '/posts/[...slug]',
    '/2009/[...slug]': '/posts/[...slug]',
    '/2010/[...slug]': '/posts/[...slug]',
    '/2011/[...slug]': '/posts/[...slug]',
    '/2012/[...slug]': '/posts/[...slug]',
    '/2013/[...slug]': '/posts/[...slug]',
    '/2014/[...slug]': '/posts/[...slug]',
    '/2015/[...slug]': '/posts/[...slug]',
    '/2016/[...slug]': '/posts/[...slug]',
    '/2017/[...slug]': '/posts/[...slug]',
    '/2018/[...slug]': '/posts/[...slug]',
    '/2019/[...slug]': '/posts/[...slug]',
    '/2020/[...slug]': '/posts/[...slug]',
    '/2021/[...slug]': '/posts/[...slug]',
    '/2022/[...slug]': '/posts/[...slug]',
    '/2023/[...slug]': '/posts/[...slug]',
  }
});