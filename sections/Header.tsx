import Image from "apps/website/components/Image.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";

type Type = "dark" | "light";

export interface CTA {
  id?: string;
  href: string;
  text: string;
  outline?: boolean;
}

// 1. Modifique a interface Link para suportar sub-links
export interface Link {
  label?: string;
  url?: string;
  children?: Link[]; // Adiciona a propriedade 'children' para o dropdown
}

export interface Nav {
  logo?: {
    src?: ImageWidget;
    alt?: string;
  };
  navigation?: {
    links: Link[]; // Usa a nova interface Link
    buttons: CTA[];
  };
}

export const ColorType: Record<Type, string> = {
  "dark": "base-content",
  "light": "base-100",
};

export const StyleType: Record<"background" | "color", string> = {
  "background": "bg-",
  "color": "text-",
};

const generateLineStyles = (position: string) => `
  absolute ${position} z-50 block h-0.5 w-7 bg-black transition-all duration-200 ease-out 
`;

const lineStyles = [
  generateLineStyles("top-[-0.7rem]") +
  "peer-checked:translate-y-[0.7rem] peer-checked:rotate-[45deg]",
  generateLineStyles("top-[-0.35rem]") + "peer-checked:opacity-0",
  generateLineStyles("top-[0]") +
  "peer-checked:-translate-y-[0.2rem] peer-checked:-rotate-[45deg]",
];

export default function Haader({
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1527/67120bcd-936a-4ea5-a760-02ed5c4a3d04",
    alt: "Logo",
  },
  navigation = {
    links: [
      { label: "Home", url: "/" },
      { label: "About us", url: "/" },
      { label: "Princing", url: "/" },
      { label: "Contact", url: "/" },
      // 2. Exemplo de link com dropdown
      {
        label: "Serviços",
        children: [
          { label: "Desenvolvimento Web", url: "/servicos/web" },
          { label: "Design UX/UI", url: "/servicos/design" },
          { label: "Consultoria", url: "/servicos/consultoria" },
        ],
      },
    ],
    buttons: [
      { id: "change-me-1", href: "/", text: "Change me", outline: false },
      { id: "change-me-2", href: "/", text: "Change me", outline: true },
    ],
  },
}: Nav) {
  // Função para renderizar os links de forma recursiva (para suportar sub-níveis, se necessário)
  const renderLinks = (links: Link[]) => {
    return links.map((link, index) => {
      // 3. Verifique se o link tem filhos para criar o dropdown
      if (link.children && link.children.length > 0) {
        return (
          <li key={index} class="relative group">
            <a
              href={link.url || "#"}
              aria-label={link.label}
              class="link no-underline hover:underline p-4"
            >
              {link.label}
              <span class="inline-block ml-1 transition-transform group-hover:rotate-180">
                ▼
              </span>
            </a>
            {/* 4. Renderize o dropdown usando classes do Tailwind CSS */}
            <ul class="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg py-2 z-50 min-w-[200px]">
              {link.children.map((child, childIndex) => (
                <li key={childIndex}>
                  <a
                    href={child.url}
                    class="block px-4 py-2 hover:bg-gray-100"
                  >
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        );
      } else {
        // Renderize um link normal
        return (
          <li key={index}>
            <a
              href={link.url}
              aria-label={link.label}
              class="link no-underline hover:underline p-4"
            >
              {link.label}
            </a>
          </li>
        );
      }
    });
  };

  return (
    <nav class="container mx-auto lg:px-0 px-4">
      <div class="flex gap-8 items-center justify-between py-4">
        <a href="/">
          <Image src={logo.src || ""} width={100} height={28} alt={logo.alt} />
        </a>

        {/* Menu Mobile */}
        <label
          class="cursor-pointer lg:hidden pt-6 relative z-40"
          for="menu-mobile"
        >
          <input class="hidden peer" type="checkbox" id="menu-mobile" />
          {lineStyles.map((style, index) => (
            <div key={index} class={`relative ${style}`}></div>
          ))}
          <div class="backdrop-blur-sm bg-black/50 fixed h-full hidden inset-0 peer-checked:block w-full z-40">
            &nbsp;
          </div>
          <div class="duration-500 fixed h-full overflow-y-auto overscroll-y-none peer-checked:translate-x-0 right-0 top-0 transition translate-x-full w-full z-40">
            <div class="bg-base-100 flex flex-col float-right gap-8 min-h-full pt-12 px-6 shadow-2xl w-1/2">
              <ul class="flex flex-col gap-8">
                {renderLinks(navigation.links)}
              </ul>
              <ul class="flex items-center gap-3">
                {navigation.buttons?.map((item) => (
                  <a
                    key={item?.id}
                    id={item?.id}
                    href={item?.href}
                    target={item?.href.includes("http") ? "_blank" : "_self"}
                    class={`font-normal btn btn-primary ${
                      item.outline && "btn-outline"
                    }`}
                  >
                    {item?.text}
                  </a>
                ))}
              </ul>
            </div>
          </div>
        </label>

        {/* Menu Desktop */}
        <ul class="hidden items-center justify-between lg:flex">
          <ul class="flex">
            {renderLinks(navigation.links)}
          </ul>
          <ul class="flex gap-3">
            {navigation.buttons?.map((item) => (
              <a
                style="background-color: black; 
                  color: white;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;"
                key={item?.id}
                id={item?.id}
                href={item?.href}
                target={item?.href.includes("http") ? "_blank" : "_self"}
                class={`font-normal btn btn-primary ${
                  item.outline && "btn-outline"
                }`}
              >
                {item?.text}
              </a>
            ))}
          </ul>
        </ul>
      </div>
    </nav>
  );
}