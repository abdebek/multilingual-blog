import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { languages, ui, defaultLang } from '../../i18n/ui';

export async function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({ params: { lang } }));
}

export async function GET(context: any) {
  const { lang } = context.params;
  const blog = await getCollection('blog', ({ data }) => data.lang === lang);
  
  const siteTitle = ui[lang as keyof typeof ui]?.['site.title'] || ui[defaultLang]['site.title'];
  const siteDescription = ui[lang as keyof typeof ui]?.['footer.description'] || ui[defaultLang]['footer.description'];

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${lang}/blog/${post.slug.split('/').pop()}/`,
    })),
    customData: `<language>${lang}</language>`,
  });
}
