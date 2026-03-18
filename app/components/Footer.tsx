import { FooterData } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import FooterAnimated from "./FooterAnimated";
import { cache } from 'react';

export const revalidate = 30; // revalidate at most 30 sec

// Normalize date to ISO string for consistency
const normalizeDate = (dateInput: string | Date | undefined): string | undefined => {
  if (!dateInput) return undefined;

  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received:', dateInput);
      return undefined;
    }
    return date.toISOString();
  } catch (error) {
    console.error('Error normalizing date:', error);
    return undefined;
  }
};

// Use React's cache() to ensure the same data is returned within the same render
// Combined with Next.js revalidation, this ensures consistency across pages
const getFooterData = cache(async (): Promise<FooterData> => {
  const query = `
    *[_type == "about"]{
      copyright,
      udDate
    }[0]
  `;

  try {
    // Fetch data from Sanity
    // Since useCdn is false, this will use Next.js data cache
    // The revalidate export ensures consistent caching across pages
    const data = await client.fetch(query);

    // Normalize the date to ISO string for consistency
    // This ensures the same date format is used everywhere
    const normalizedData: FooterData = {
      copyright: data?.copyright || '© 2024',
      udDate: data?.udDate ? normalizeDate(data.udDate) || data.udDate : new Date().toISOString(),
    };

    return normalizedData;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    // Return fallback data with current date
        return {
      copyright: '© 2024',
      udDate: new Date().toISOString(),
    };
  }
});

export default async function Footer() {
  // This will return the same cached data across all pages
  const data = await getFooterData();
  return <FooterAnimated data={data} />;
}
