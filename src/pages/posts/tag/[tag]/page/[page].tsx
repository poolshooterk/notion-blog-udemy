import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  MetaData,
  getAllPosts,
  getAllTags,
  getNumberOfPages,
  getNumberOfPagesByTag,
  getPostsByPage,
  getPostsByTagAndPage,
  getPostsForTopPage,
} from '../../../../../../lib/notionAPI';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from 'next';
import SinglePost from '../../../../../components/Post/SinglePost';
import Tag from '@/components/Tag/Tag';
import Pagination from '@/components/Pagination/Pagination';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  posts: MetaData[];
  numberOfPage: number;
  currentTag: string;
  allTags: string[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allTags = await getAllTags();
  const numberOfPage = await getNumberOfPagesByTag('Blog');

  let params: { params: { tag: string; page: string } }[] = [];
  await Promise.all(
    allTags.map((tag) => {
      return getNumberOfPagesByTag(tag).then((numberOfPageByTag: number) => {
        for (let i = 1; i <= numberOfPageByTag; i++) {
          params.push({ params: { tag: tag, page: i.toString() } });
        }
      });
    })
  );

  return {
    paths: params,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (
  context
): Promise<GetStaticPropsResult<Props>> => {
  const currentPage: string = context.params?.page?.toString() ?? '';
  const currentTag: string = context.params?.tag?.toString() ?? '';

  const upperCaseCurrentTag =
    currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(
    upperCaseCurrentTag,
    parseInt(currentPage, 10)
  );

  const numberOfPage = await getNumberOfPagesByTag(upperCaseCurrentTag);

  const allTags = await getAllTags();

  return {
    props: {
      posts,
      numberOfPage,
      currentTag,
      allTags,
    },
    revalidate: 10,
  };
};

const BlogTagPageList: NextPage<Props> = ({
  posts,
  numberOfPage,
  currentTag: tag,
  allTags,
}) => {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {posts.map((post) => (
            <div key={post.id}>
              <SinglePost {...post} isPagenationPage={true} />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPage} tag={tag} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogTagPageList;
