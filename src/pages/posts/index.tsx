import Head from "next/head";
import styles from "./styles.module.scss";
import { createClient } from "../../services/prismicio";
import { GetStaticProps } from "next";
import { RichText } from "prismic-reactjs";
import Link from "next/link";
import { PrismicError } from "@prismicio/client";

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
  const client = createClient({ previewData });

  try {
    const response = await client.getAllByType("publication");

    const posts = response.map((post) => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        excerpt:
          post.data.content.find((content) => content.type === "paragraph")
            ?.text ?? "",
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      };
    });

    return {
      props: { posts },
    };
  } catch (error) {
    console.log(error instanceof PrismicError);
    console.log("Error ao buscar: ", error);

    return {
      notFound: true,
    };
  }
};
