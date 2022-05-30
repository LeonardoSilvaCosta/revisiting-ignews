import Head from "next/head";
import styles from "./styles.module.scss";
import { GetStaticProps } from "next";
import Link from "next/link";
import { getAllPostsByType } from '../../services/prismicio';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const posts = await getAllPostsByType (previewData);

  return {
    props: { posts },
  };
};
