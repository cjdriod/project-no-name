import type {APIRoute} from "astro";

export const GET: APIRoute = ({site}) => {
  let robotsText = `User-agent: *\nAllow: /\n`;

  if (site) {
    robotsText += `\nSitemap: ${new URL('sitemap-index.xml', site).href}`;
  }

  return new Response(robotsText)
};
