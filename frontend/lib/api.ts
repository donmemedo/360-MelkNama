export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export type Agent = {
  id: string; name_en: string; name_fa: string; city: string; rating: number;
  reviews: number; deals: number; years: number; license: string; avatar: string;
  phone: string; specialty_en: string; specialty_fa: string; active_listings?: number;
};

export type Listing = {
  id: string; deal: "sale" | "rent"; city: string; city_en: string; city_fa: string;
  district_en: string; district_fa: string; region: number; address_en: string; address_fa: string;
  title_en: string; title_fa: string; type: string; type_en: string; type_fa: string;
  price: number; price_per_m: number; rent_deposit: number; rent_monthly: number;
  estimate: number; estimate_delta: number; area: number; beds: number; baths: number;
  parking: number; floor: number; year_built: number; lat: number; lng: number;
  images: string[]; amenities: { key: string; en: string; fa: string }[];
  verified: boolean; tour360: boolean; hot: boolean; open_house: string | null;
  listed_at: string; days_on_market: number; views: number; saves: number;
  walk_score: number; transit_score: number; trust_score: number;
  desc_en: string; desc_fa: string; agent?: Agent;
  price_history: { date: string; price: number }[];
  similar?: Listing[];
};

export type Meta = {
  cities: { slug: string; name_en: string; name_fa: string; lat: number; lng: number;
    districts: { en: string; fa: string; region: number; avg_price_per_m: number }[] }[];
  property_types: { key: string; en: string; fa: string }[];
  amenities: { key: string; en: string; fa: string }[];
  sorts: string[];
};

export type Market = {
  total_listings: number; verified_ratio: number; tour_ratio: number;
  median_price: number; avg_price_per_m: number; avg_days_on_market: number;
  districts: { district_en: string; district_fa: string; avg_price_per_m: number; count: number }[];
  trend: { label: string; avg_price_per_m: number }[];
};

export const getMeta = () => get<Meta>("/api/meta");
export const getMarket = (city?: string) => get<Market>(`/api/market${city ? `?city=${city}` : ""}`);
export const getAgents = (city?: string) => get<{ items: Agent[] }>(`/api/agents${city ? `?city=${city}` : ""}`);
export const getListing = (id: string) => get<Listing>(`/api/listings/${id}`);
export const getListings = (qs: string) =>
  get<{ total: number; page: number; pages: number; avg_price_per_m: number; items: Listing[] }>(
    `/api/listings${qs ? `?${qs}` : ""}`,
  );
