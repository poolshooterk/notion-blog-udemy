import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  MetaData,
  getAllPosts,
  getAllTags,
  getPostsForTopPage,
} from '../../lib/notionAPI';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { GetStaticProps, GetStaticPropsResult, NextPage } from 'next';
import SinglePost from '../components/Post/SinglePost';
import Link from 'next/link';
import Tag from '@/components/Tag/Tag';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  fourPosts: MetaData[];
  allTags: string[];
};

export const getStaticProps: GetStaticProps = async (): Promise<
  GetStaticPropsResult<Props>
> => {
  const fourPosts = await getPostsForTopPage();
  const allTags = await getAllTags();

  return {
    props: {
      fourPosts,
      allTags,
    },
    revalidate: 60 * 60 * 6,
  };
};

const Home: NextPage<Props> = ({ fourPosts, allTags }) => {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
        {fourPosts.map((post) => (
          <div className="mx-4" key={post.id}>
            <SinglePost {...post} isPagenationPage={false} />
          </div>
        ))}
        <Link
          href="/posts/page/1"
          className="mb-6 lg:w-1/2 mx-auto px-5 block text-right "
        >
          ...もっと見る
        </Link>
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default Home;
