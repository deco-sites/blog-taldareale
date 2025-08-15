import { LoaderContext } from "deco/types.ts";

/**
 * @title Category from URL
 * @description Extracts the category from the current URL path
 */
export default function categoryFromUrl(
  _props: unknown,
  req: Request,
  ctx: LoaderContext,
): string | null {
  // Get the URL and extract the pathname
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Match the pattern /categorias/:category
  const match = pathname.match(/\/categorias\/([^\/\?]+)/);
  
  if (match && match[1]) {
    // Decode URI component to handle special characters
    const category = decodeURIComponent(match[1]);
    return category;
  }
  
  return null;
}