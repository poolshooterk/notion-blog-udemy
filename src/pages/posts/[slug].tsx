import React from 'react';
import { MetaData, getAllPosts, getSinglePost } from '../../../lib/notionAPI';
import { GetStaticPropsResult } from 'next';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

type Props = {
  metadata: MetaData;
  markdown: string;
};

export const getStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<Props>> => {
  const post = await getSinglePost(params.slug);
  return {
    props: {
      metadata: post.metadata,
      markdown: post.markdown,
    },
    revalidate: 60 * 60 * 6,
  };
};

const Post = ({ metadata, markdown }: Props) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mt-20">
      <h2 className="w-full text-2xl font-medium">{metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">Posted date at {metadata.date}</span>
      <br />
      {metadata.tags.map((tag) => (
        <p
          key={tag}
          className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2"
        >
          <Link href={`/posts/tag/${tag}/page/1`}>{tag}</Link>
        </p>
      ))}
      <div className="mt-10 font-medium">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code>{children}</code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>

        <Link href="/">
          <span className="pb-20 block mt-3 text-sky-900">←ホームに戻る</span>
        </Link>
      </div>
    </section>
  );
};

export default Post;
