import { LoaderContext } from "deco/types.ts";

export interface Props {
  /**
   * @title Category Slug
   * @description The category slug from URL parameter
   */
  categorySlug?: string;
}

export const loader = (props: Props, req: Request, ctx: LoaderContext) => {
  // Get the URL and extract the pathname
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Match the pattern /categorias/:category
  const match = pathname.match(/\/categorias\/([^\/\?]+)/);
  
  let categorySlug = null;
  if (match && match[1]) {
    // Skip if it's a template parameter (starts with :)
    if (!match[1].startsWith(':')) {
      // Decode URI component to handle special characters
      categorySlug = decodeURIComponent(match[1]);
    }
  }
  
  return {
    ...props,
    categorySlug
  };
};

export default function CategoryHero({
  categorySlug
}: Props) {
  // If no category slug, don't render anything
  if (!categorySlug) {
    return null;
  }

  // Convert slug to uppercase for display
  const categoryName = categorySlug.toUpperCase();
  
  return (
    <div class="container lg:mx-auto lg:py-14 mx-2 py-12">
      <div class="text-center space-y-4">
        <h1 class="text-4xl lg:text-6xl font-bold">
          {categoryName}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Confira todas os posts sobre {categoryName.toLowerCase()}
        </p>
      </div>
    </div>
  );
}