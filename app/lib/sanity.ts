import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { sanityEnv } from "./env";

const sanityConfig = {
  apiVersion: sanityEnv.apiVersion,
  dataset: sanityEnv.dataset,
  projectId: sanityEnv.projectId,
  useCdn: sanityEnv.useCdn,
};

export const client = createClient(sanityConfig);

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
