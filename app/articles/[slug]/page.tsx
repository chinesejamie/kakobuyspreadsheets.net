// app/articles/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';
import articles from '@/content/articles';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/articles/${params.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  const filePath = path.join(process.cwd(), 'content', 'articles', article.file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content } = matter(fileContent);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 prose prose-neutral prose-lg">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
