import * as prismic from "@prismicio/client";
import sm from "../../sm.json";
import { RichText } from "prismic-dom";

export const endpoint = sm.apiEndpoint;
export const repositoryName = prismic.getRepositoryName(endpoint);

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc) {
  switch (doc.type) {
    case "publication":
      return "/posts";
    case "page":
      return `/${doc.uid}`;
    default:
      return null;
  }
}

export function createClient(config = {}) {
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return client;
}

export async function getAllPostsByType(previewData) {
  const client = createClient({ previewData });

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

  return posts;
}
