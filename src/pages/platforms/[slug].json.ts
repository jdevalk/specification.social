import { platforms } from "~/lib/platforms";
export function getStaticPaths() {
  return platforms.map((platform) => ({
    params: { slug: platform.slug },
    props: { platform },
  }));
}
export function GET({ props }: { props: { platform: (typeof platforms)[number] } }) {
  return new Response(JSON.stringify(props.platform, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
