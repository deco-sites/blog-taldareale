import { LoaderContext } from "deco/types.ts";

// 1. Defina o objeto JSON com os dados das categorias.
const categoriesData = {
  "joias-e-acessorios": {
    "title": "Joias e acessórios",
    "description": "Explore o universo fascinante das joias e acessórios.Aqui, você descobre a história por trás de cada peça, aprende sobre os diferentes materiais e encontra o significado especial que torna cada acessório único. A escolha perfeita para quem ama conhecer os detalhes que fazem a diferença."
  },
  "estilo-e-tendencias": {
    "title": "Estilo e tendências",
    "description": "Descubra como usar suas joias e acessórios para criar looks inesquecíveis. Aqui, exploramos as últimas tendências do mundo da moda, ensinamos a combinar peças com seu estilo pessoal e damos inspirações para você brilhar em qualquer ocasião. Seu guia definitivo para um visual sempre atual e cheio de personalidade."
  },
  "dicas": {
    "title": "Dicas",
    "description": "Aqui, você encontra truques práticos para limpar, conservar e organizar suas joias favoritas. Com nossas dicas, você mantém o brilho por muito mais tempo e garante que seus acessórios estejam sempre perfeitos para qualquer ocasião."
  },
  "piercings": {
    "title": "Piercings",
    "description": "Explore o universo dos piercings e descubra como expressar sua individualidade. Nesta seção, você encontra guias completos sobre os diferentes tipos de perfuração, dicas de cuidados essenciais para uma cicatrização perfeita e inspirações para escolher a joia que mais combina com você."
  },
  "corentes-e-colares": {
    "title": "Correntes e colares",
    "description": "Do clássico ao contemporâneo, encontre a joia perfeita para cada momento. Explore nossa seleção de correntes e colares, aprenda a criar mix de peças cheios de personalidade e descubra como um simples acessório pode transformar completamente o seu look, adicionando um toque de sofisticação e brilho."
  },
  "broches": {
    "title": "Broches",
    "description": "Redescubra a elegância atemporal dos broches. Aqui, mostramos como essa joia versátil pode adicionar um toque de requinte a qualquer look, desde um blazer clássico até um vestido de festa. Aprenda a usar e a colecionar peças que são verdadeiras declarações de estilo."
  },
  "aneis-e-aliancas": {
    "title": "Anéis e alianças",
    "description": "Celebre o amor e os momentos inesquecíveis. Nesta seção, você encontra tudo sobre anéis e alianças: desde guias para escolher a peça perfeita que simboliza sua união, até dicas de como combinar diferentes anéis para criar um mix moderno e cheio de significado."
  },
  "presentes": {
    "title": "Presentes",
    "description": "Encontre o presente perfeito para surpreender quem você ama. Com nossas sugestões de joias e acessórios para todas as ocasiões e estilos, presentear se torna uma tarefa fácil e prazerosa. Descubra opções que encantam e emocionam, tornando qualquer momento inesquecível."
  },
  "ocasioes-especiais": {
    "title": "Ocasiões especiais",
    "description": "Brilhe nos momentos mais importantes da sua vida. Seja para um casamento, formatura ou uma festa de gala, aqui você encontra a joia perfeita para completar seu look. Conte com nossas dicas para escolher o acessório certo e se sentir deslumbrante em qualquer celebração."
  },
  "celebridades": {
    "title": "Celebridades",
    "description": "Inspire-se no estilo das estrelas. Fique por dentro das joias e acessórios que as celebridades estão usando nos tapetes vermelhos e no dia a dia. Descubra as tendências lançadas pelas famosas e aprenda a adaptar esses looks para o seu próprio estilo."
  },
};

export interface Props {
  /**
   * @title Category Slug
   * @description The category slug from URL parameter
   */
  categorySlug?: string;
  /**
   * @title Category Title
   * @description The title for the category page
   */
  title?: string;
  /**
   * @title Category Description
   * @description The description for the category page
   */
  description?: string;
}

export const loader = (props: Props, req: Request, ctx: LoaderContext) => {
  // Get the URL and extract the pathname
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Match the pattern /categorias/:category
  const match = pathname.match(/\/categorias\/([^\/\?]+)/);
  
  let categorySlug = null;
  let categoryInfo = null;

  if (match && match[1]) {
    // Skip if it's a template parameter (starts with :)
    if (!match[1].startsWith(':')) {
      // Decode URI component to handle special characters
      categorySlug = decodeURIComponent(match[1]);
      // 2. Busque a informação da categoria no JSON.
      categoryInfo = categoriesData[categorySlug];
    }
  }
  
  return {
    ...props,
    categorySlug,
    // 3. Passe o título e a descrição para o componente.
    title: categoryInfo ? categoryInfo.title : null,
    description: categoryInfo ? categoryInfo.description : null,
  };
};

export default function CategoryHero({
  categorySlug,
  title, // Adicionado 'title'
  description // Adicionado 'description'
}: Props) {
  // If no category slug, don't render anything
  if (!categorySlug || !title || !description) {
    return null;
  }

  // Convert slug to uppercase for display
  const categoryName = categorySlug.toUpperCase();
  
  return (
    <div class="container lg:mx-auto lg:py-14 mx-2 py-12">
      <div class="text-center space-y-4">
        <h1 class="text-4xl lg:text-6xl font-bold">
          {categoryName.toUpperCase()}
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}