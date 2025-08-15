import InstagramEmbedIsland from "../islands/InstagramEmbed.tsx";

export interface Props {
  /** URL do post do Instagram */
  instagramUrl: string;
  /** Largura máxima do embed (padrão: 540px) */
  maxWidth?: number;
  /** Centralizar o embed */
  centered?: boolean;
}

export default function InstagramEmbed({ 
  instagramUrl, 
  maxWidth = 540, 
  centered = true 
}: Props) {
  return (
    <div class={`my-8 ${centered ? 'flex justify-center' : ''}`}>
      <div 
        class="instagram-embed" 
        style={{ maxWidth: `${maxWidth}px`, width: '100%' }}
      >
        <InstagramEmbedIsland url={instagramUrl} />
      </div>
    </div>
  );
}