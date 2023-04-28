import Image from 'next/image';
import { Inter } from 'next/font/google';
import {
  MetaData,
  getAllPosts,
  getAllTags,
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from '../../../../lib/notionAPI';
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
import SinglePost from '../../../components/Post/SinglePost';
import Pagination from '@/components/Pagination/Pagination';
import Tag from '@/components/Tag/Tag';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  postsByPage: MetaData[];
  numberOfPage: number;
  allTags: string[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages();
  const params: { params: { page: string } }[] = new Array<string>(
    numberOfPage
  ).map((_, index) => {
    return {
      params: {
        page: index.toString(),
      },
    };
  });

  return {
    paths: params,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (
  context
): Promise<GetStaticPropsResult<Props>> => {
  const page = context.params?.page;
  const currentPage = context.params?.page;
  const postsByPage = await getPostsByPage(
    parseInt((page ?? 0).toString(), 10)
  );
  const numberOfPage = await getNumberOfPages();

  const allTags = await getAllTags();

  return {
    props: {
      postsByPage,
      numberOfPage,
      allTags,
    },
    revalidate: 60 * 60 * 6,
  };
};

const BlogPageList: NextPage<Props> = ({
  postsByPage,
  numberOfPage,
  allTags,
}) => {
  return (
    <div className="container h-full w-full mx-auto">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
          {postsByPage.map((post) => (
            <div key={post.id}>
              <SinglePost {...post} isPagenationPage={true} />
            </div>
          ))}
        </section>
        <Pagination numberOfPage={numberOfPage} tag={''} />
        <Tag tags={allTags} />
      </main>
    </div>
  );
};

export default BlogPageList;
