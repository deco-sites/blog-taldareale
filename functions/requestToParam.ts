import { FnContext } from "deco/types.ts";

export interface Props {
  param: string;
}

/**
 * @title Request to Param
 * @description Extracts a URL parameter from the current request
 */
export default function requestToParam(
  props: Props,
  req: Request,
): string | null {
  const { param } = props;
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  
  // For a URL like /categorias/dicas, we want to extract "dicas" when param is "category"
  if (param === "category" && pathSegments[0] === "categorias") {
    return pathSegments[1] || null;
  }
  
  // For other parameters, try to get from URL search params
  return url.searchParams.get(param);
}