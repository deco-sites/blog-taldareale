import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { useSection } from "deco/hooks/useSection.ts";
import { ComponentChildren, Fragment } from "preact";
import { BlogPost } from "apps/blog/types.ts";
import { useId } from "../sdk/useId.ts";

export interface CTA {
  text?: string;
}

export interface FilterOptions {
  /** @title Search by title */
  title?: string;
  /** @title Search by content */
  content?: string;
  /** @title Search by excerpt */
  excerpt?: string;
  /** @title Filter by author name */
  authorName?: string;
  /** @title Filter by category name */
  categoryName?: string;
  /** @title Filter by category slug */
  categorySlug?: string;
  /** @title Date from (YYYY-MM-DD) */
  dateFrom?: string;
  /** @title Date to (YYYY-MM-DD) */
  dateTo?: string;
  /** @title Search in SEO title */
  seoTitle?: string;
  /** @title Search in SEO description */
  seoDescription?: string;
}

export interface Props {
  cta?: CTA;
  posts?: BlogPost[] | null;
  /** @title Filter Options */
  filters?: FilterOptions;
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

function filterPosts(posts: BlogPost[], filters: FilterOptions): BlogPost[] {
  if (!posts || !Array.isArray(posts)) return [];
  
  // Check if any filters are actually provided
  const hasFilters = Object.values(filters).some(filter => 
    filter !== undefined && filter !== null && filter !== ''
  );
  
  // If no filters are provided, return all posts
  if (!hasFilters) {
    return posts;
  }
  
  return posts.filter((post) => {
    // Skip if post is undefined or null
    if (!post) return false;
    
    // Filter by title
    if (filters.title && !post.title?.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    
    // Filter by content
    if (filters.content && !post.content?.toLowerCase().includes(filters.content.toLowerCase())) {
      return false;
    }
    
    // Filter by excerpt
    if (filters.excerpt && !post.excerpt?.toLowerCase().includes(filters.excerpt.toLowerCase())) {
      return false;
    }
    
    // Filter by author name
    if (filters.authorName) {
      const hasAuthor = post.authors?.some(author => 
        author.name?.toLowerCase().includes(filters.authorName!.toLowerCase())
      );
      if (!hasAuthor) return false;
    }
    
    // Filter by category name
    if (filters.categoryName) {
      const hasCategory = post.categories?.some(category => 
        category.name?.toLowerCase().includes(filters.categoryName!.toLowerCase())
      );
      if (!hasCategory) return false;
    }
    
    // Filter by category slug
    if (filters.categorySlug) {
      const hasCategorySlug = post.categories?.some(category => 
        category?.slug?.toLowerCase().includes(filters.categorySlug!.toLowerCase())
      );
      if (!hasCategorySlug) return false;
    }
    
    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const postDate = new Date(post.date || '');
      
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (postDate < fromDate) return false;
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        if (postDate > toDate) return false;
      }
    }
    
    // Filter by SEO title
    if (filters.seoTitle && !post.seo?.title?.toLowerCase().includes(filters.seoTitle.toLowerCase())) {
      return false;
    }
    
    // Filter by SEO description
    if (filters.seoDescription && !post.seo?.description?.toLowerCase().includes(filters.seoDescription.toLowerCase())) {
      return false;
    }
    
    return true;
  });
}

export default function GenericFilterBlogPost({
  cta = { text: "Mostrar mais" },
  posts,
  filters = {},
  pagination: {
    page = 0,
    perPage = 6,
  } = {},
}: Props) {
  // Apply filters first
  const filteredPosts = filterPosts(posts || [], filters);
  
  const from = perPage * page;
  const to = perPage * (page + 1);

  // It's boring to generate ids. Let's autogen them
  const postList = useId();

  // Get the HTMX link for this section
  const fetchMoreLink = useSection({
    // Renders this section with the next page
    props: {
      filters,
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
          {filteredPosts.slice(from, to).map((post) => (
            <a
              href={`/${post.slug}`}
              class="border border-secondary overflow-hidden rounded-lg hover:shadow-lg transition-shadow flex flex-col"
            >
              <div class="w-full">
                <Image
                  width={380}
                  height={274}
                  class="object-cover w-full h-48"
                  sizes="(max-width: 1024px) 100vw, 100vw"
                  src={post.image || ""}
                  alt={post.image}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <div class="p-6 space-y-4 flex flex-col justify-between flex-grow">
                <div class="space-y-4">
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
                </div>
                <div class="flex flex-wrap gap-2 mt-auto">
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
        
        {/* No results message */}
        {filteredPosts.length === 0 && page === 0 && (
          <div class="text-center py-12">
            <h3 class="text-xl font-semibold mb-2">Nenhum post encontrado</h3>
            <p class="text-gray-600">
              Tente ajustar os filtros para encontrar o conteúdo desejado.
            </p>
          </div>
        )}
        
        {filteredPosts && to < filteredPosts.length && (
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