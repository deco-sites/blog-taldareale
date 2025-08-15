import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { ComponentChildren, Fragment } from "preact";
import { BlogPost } from "apps/blog/types.ts";
import { useId } from "../sdk/useId.ts";

export interface CTA {
  text?: string;
}

/** @title {{{title}}} */
export interface Post {
  url?: string;
  title?: string;
  author?: string;
  excerpt?: string;
  image?: ImageWidget;
  date?: string;
  readingTime?: string;
  tags?: string[];
}

export interface Props {
  cta?: CTA;
  posts?: BlogPost[] | null;
  pagination?: {
    /**
     * @title First page
     * @description Leave it as 0 to start from the first page
     */
    page?: number;
    /** @title items per page */
    perPage?: number;
  };
}

function Container({ children }: { children: ComponentChildren }) {
  return (
    <div class="container lg:mx-auto lg:py-14 mx-2 py-12 text-sm">
      <div class="space-y-8">{children}</div>
    </div>
  );
}

export default function BlogPosts({
  cta = { text: "Mostre mais" },
  posts,
  pagination: {
    page = 0,
    perPage = 6,
  } = {},
}: Props) {
  const from = perPage * page;
  const to = perPage * (page + 1);

  // It's boring to generate ids. Let's autogen them
  const postList = useId();

  // Get the HTMX link for this section
  const fetchMoreLink = useSection({
    // Renders this section with the next page
    props: {
      pagination: { perPage, page: page + 1 },
    },
  });

  function calculateReadingTime(words: number): string {
    const wordsPerMinute = 250;
    const estimatedTimeMinutes = words / wordsPerMinute;

    const roundedReadingTime = Math.round(estimatedTimeMinutes);
    return `${roundedReadingTime} min`;
  }

  const ContainerComponent = page === 0 ? Container : Fragment;

  return (
    <ContainerComponent>
      <>
        <div class="gap-8 grid grid-cols-1">
          {posts?.slice(from, to).map((post) => (
            <a
              href={`/${post.slug}`}
              class="border border-secondary overflow-hidden rounded-lg flex flex-col md:flex-row gap-4"
            >
              <div class="md:w-1/3 flex-shrink-0">
                <Image
                  width={380}
                  height={274}
                  class="object-cover w-full h-48 md:h-full"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  src={post.image || ""}
                  alt={post.image}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <div class="p-6 space-y-4 md:w-2/3">
                <div class="font-semibold">
                  {calculateReadingTime(post.content.split(" ").length)}
                </div>
                <div class="space-y-2">
                  <h3 class="text-2xl">{post.title}</h3>
                  <p class="text-base">{post.excerpt}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  {post.categories?.map((category) => (
                    <a 
                      href={`/categorias/${category.slug}`}
                      style="
                        background-color: black; /* Preenchimento preto */
                        color: white;           /* Texto em branco */
                        padding: 10px 10px;    /* Espaçamento interno */
                        border: none;           /* Remove a borda padrão */
                        border-radius: 25px;    /* Borda arredondada */
                        text-decoration: none;  /* Remove sublinhado */
                        display: inline-block;  /* Para funcionar como botão */
                      "
                      class="badge badge-lg badge-primary text-xs hover:opacity-80">
                      {category.name}
                    </a>
                  ))}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span>
                    {post.date
                      ? new Date(post.date).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      : ""}
                  </span>
                  <span>•</span>
                  <span>{post.authors[0]?.name}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {posts && to < posts.length && (
          <div class="flex justify-center w-full" id={postList}>
            <button
              style="
                background-color: black; /* Preenchimento preto */
                color: white;           /* Texto em branco */
                padding: 10px 20px;    /* Espaçamento interno */
                border: none;           /* Remove a borda padrão */
                border-radius: 5px;    /* Borda arredondada */
              "
              hx-get={fetchMoreLink}
              hx-swap="outerHTML"
              hx-target={`#${postList}`}
              aria-label={cta.text}
              class="btn btn-primary"
            >
              <span class="inline [.htmx-request_&]:hidden">
                {cta.text}
              </span>
              <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
            </button>
          </div>
        )}
      </>
    </ContainerComponent>
  );
}
