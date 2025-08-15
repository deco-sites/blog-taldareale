import type { ImageWidget } from "apps/admin/widgets.ts";

export interface Card {
  /** Imagem do card */
  image: ImageWidget;
  /** Texto alternativo da imagem */
  alt?: string;
  /** Título do card */
  title?: string;
  /** Descrição do card */
  description?: string;
  /** Link do card (opcional) */
  href?: string;
}

export interface Props {
  /** Título da seção */
  sectionTitle?: string;
  /** Lista de cards */
  cards?: Card[];
  /** Quantos cards por linha no desktop */
  cardsPerRow?: 2 | 3 | 4;
  /** Espaçamento entre os cards */
  gap?: "small" | "medium" | "large";
}

export default function ImageTextCards({
  sectionTitle = "Nossos Cards",
  cards = [],
  cardsPerRow = 3,
  gap = "medium"
}: Props) {
  const gapClasses = {
    small: "gap-4",
    medium: "gap-6", 
    large: "gap-8"
  };

  const gridClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <section class="w-full py-12 px-4">
      <div class="max-w-7xl mx-auto">
        {sectionTitle && (
          <h2 class="text-3xl font-bold text-center mb-8 text-gray-900">
            {sectionTitle}
          </h2>
        )}
        
        <div class={`grid ${gridClasses[cardsPerRow]} ${gapClasses[gap]}`}>
          {cards.map((card, index) => {
            const CardContent = () => (
              <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Imagem em cima */}
                <div class="aspect-video w-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.alt || card.title || `Card ${index + 1}`}
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                {/* Texto embaixo */}
                <div class="p-6">
                  {card.title && (
                    <h3 class="text-xl font-semibold mb-3 text-gray-900">
                      {card.title}
                    </h3>
                  )}
                  {card.description && (
                    <p class="text-gray-600 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>
              </div>
            );

            // Se tem link, envolve em um <a>
            if (card.href) {
              return (
                <a
                  key={index}
                  href={card.href}
                  class="block hover:no-underline"
                >
                  <CardContent />
                </a>
              );
            }

            // Se não tem link, só retorna o card
            return (
              <div key={index}>
                <CardContent />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}