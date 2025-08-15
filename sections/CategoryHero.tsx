import { useScript } from "deco/hooks/useScript.ts";

export interface Props {
  /**
   * @title Category Name
   * @description The category name from URL parameter
   */
  categoryName?: string;
  
  /**
   * @title Page Title
   * @description Custom title for the category page
   */
  title?: string;
  
  /**
   * @title Description
   * @description Description for the category
   */
  description?: string;
}

const script = () => {
  // Get category from URL parameter
  const urlPath = window.location.pathname;
  const categorySlug = urlPath.split('/categorias/')[1];
  
  if (categorySlug) {
    // Capitalize first letter and replace hyphens with spaces
    const categoryName = categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Update the category name in the title
    const titleElement = document.querySelector('[data-category-title]');
    if (titleElement) {
      titleElement.textContent = `Categoria: ${categoryName}`;
    }
    
    // Update page title
    document.title = `${categoryName} - Blog Tal da Realeza`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Confira todos os posts sobre ${categoryName} no blog da Tal da Realeza. Dicas, tendências e muito mais!`);
    }
  }
};

export default function CategoryHero({
  categoryName,
  title,
  description = "Confira todos os posts desta categoria"
}: Props) {
  return (
    <>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(script) }}
      />
      <div class="container lg:mx-auto lg:py-14 mx-2 py-12">
        <div class="text-center space-y-4">
          <h1 
            class="text-4xl lg:text-6xl font-bold"
            data-category-title
          >
            {title || "Categoria"}
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}