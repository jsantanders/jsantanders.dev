import type { Post } from "content-collections";
import { baseUrl, createCompleteUrl } from "@/config";
import type { Blog, BlogPosting, Person } from "schema-dts";

const author: Person = {
  "@type": "Person",
  name: "Jesus Santander",
  url: baseUrl,
};

const blog: Blog = {
  "@type": "Blog",
  name: "jsantanders.dev",
  url: baseUrl,
  image: `${baseUrl}/opengraph-image`,
  description: "A site about software development by Jesus Santander",
  author,
};

export function BlogSchema() {
  return <JsonLdSchema schema={blog} />;
}

type BlogPostingSchemaProps = {
  post: Post;
};

export function BlogPostingSchema({ post }: BlogPostingSchemaProps) {
  const url = createCompleteUrl(post.url);
  const schema: BlogPosting = {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,

    url,
    image: `${url}/opengraph-image`,

    datePublished: post.date,
    dateCreated: post.date,
    dateModified: post.lastModification,

    author,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": baseUrl,
    },
  };
  return <JsonLdSchema schema={schema} />;
}

type JsonLdSchemaProps = {
  schema: object;
};

function JsonLdSchema({ schema }: JsonLdSchemaProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          ...schema,
        }),
      }}
    />
  );
}
