import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type Inmate = {
  id?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  county: string;
  created_at?: string;
};

export type County = {
  id: number;
  name: string;
  created_at?: string;
};

// List of Wisconsin counties in alphabetical order
export const WISCONSIN_COUNTIES = [
  'Adams', 'Ashland', 'Barron', 'Bayfield', 'Brown', 'Buffalo', 'Burnett', 'Calumet',
  'Chippewa', 'Clark', 'Columbia', 'Crawford', 'Dane', 'Dodge', 'Door', 'Douglas',
  'Dunn', 'Eau Claire', 'Florence', 'Fond du Lac', 'Forest', 'Grant', 'Green', 'Green Lake',
  'Iowa', 'Iron', 'Jackson', 'Jefferson', 'Juneau', 'Kenosha', 'Kewaunee', 'La Crosse',
  'Lafayette', 'Langlade', 'Lincoln', 'Manitowoc', 'Marathon', 'Marinette', 'Marquette', 'Menominee',
  'Milwaukee', 'Monroe', 'Oconto', 'Oneida', 'Outagamie', 'Ozaukee', 'Pepin', 'Pierce',
  'Polk', 'Portage', 'Price', 'Racine', 'Richland', 'Rock', 'Rusk', 'Sauk',
  'Sawyer', 'Shawano', 'Sheboygan', 'St. Croix', 'Taylor', 'Trempealeau', 'Vernon', 'Vilas',
  'Walworth', 'Washburn', 'Washington', 'Waukesha', 'Waupaca', 'Waushara', 'Winnebago', 'Wood'
];

// Function to save inmates to Supabase
export async function saveInmates(inmates: Omit<Inmate, 'id' | 'created_at'>[]): Promise<void> {
  try {
    console.log(`Attempting to save ${inmates.length} inmates to Supabase...`);

    // Check if Supabase URL and key are set
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL or anon key is not set in environment variables');
    }

    // Create IDs and deduplicate inmates
    const uniqueInmates = new Map();

    inmates.forEach(inmate => {
      const id = `${inmate.county}-${inmate.last_name}-${inmate.first_name.replace("Name", "")}`.toLowerCase().replace(/\s+/g, '-');
      uniqueInmates.set(id, { ...inmate, id });
    });

    const inmatesWithIds = Array.from(uniqueInmates.values());


    const { error, data } = await supabase
      .from('inmates')
      .upsert(inmatesWithIds, { onConflict: 'id' });

    if (error) {
      console.error('Supabase error details:');
      throw error;
    }

    console.log(`Successfully saved ${inmatesWithIds.length} inmates to Supabase`);
  } catch (error) {
    console.error('Error saving inmates to Supabase:', error);
    throw error;
  }
}

// Function to get inmates by county
export async function getInmatesByCounty(county: string): Promise<Inmate[]> {
  try {
    const { data, error } = await supabase
      .from('inmates')
      .select('*')
      .eq('county', county)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching inmates for ${county}:`, error);
    return [];
  }
}

// Function to get inmates by county with pagination and search
export async function getInmatesByCountyPaginated(
  county: string,
  page: number = 1,
  pageSize: number = 25,
  searchTerm: string = ''
): Promise<{ inmates: Inmate[], totalCount: number }> {
  try {
    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from('inmates')
      .select('*', { count: 'exact' })
      .eq('county', county);

    // Add search filter if provided
    if (searchTerm) {
      // Search in both first and last name
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
    }

    // Add pagination and ordering
    const { data, error, count } = await query
      .order('last_name', { ascending: true })
      .range(from, to);

    if (error) throw error;

    return {
      inmates: data || [],
      totalCount: count || 0
    };
  } catch (error) {
    console.error(`Error fetching paginated inmates for ${county}:`, error);
    return { inmates: [], totalCount: 0 };
  }
}

// Function to initialize counties table with all Wisconsin counties
export async function initializeCounties(): Promise<void> {
  try {
    console.log('Initializing counties table...');

    // Create county objects with IDs based on alphabetical order
    const counties: County[] = WISCONSIN_COUNTIES.map((name, index) => ({
      id: index + 1, // 1-based indexing
      name
    }));

    // Upsert counties to ensure they exist
    const { error } = await supabase
      .from('counties')
      .upsert(counties, { onConflict: 'id' });

    if (error) {
      console.error('Supabase error details:');
      throw error;
    }

    console.log(`Successfully initialized ${counties.length} counties`);
  } catch (error) {
    console.error('Error initializing counties in Supabase:', error);
    throw error;
  }
}

// Function to get all counties from the counties table
export async function getCounties(): Promise<County[]> {
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching counties:', error);
    return [];
  }
}

// Function to get county by ID
export async function getCountyById(id: number): Promise<County | null> {
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching county with ID ${id}:`, error);
    return null;
  }
}

// Function to get county by name
export async function getCountyByName(name: string): Promise<County | null> {
  try {
    const { data, error } = await supabase
      .from('counties')
      .select('*')
      .ilike('name', name)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching county with name ${name}:`, error);
    return null;
  }
}

// Function to get all counties with inmates
export async function getAllCounties(): Promise<string[]> {
  try {
    // Using a raw SQL query to get distinct counties
    const { data, error } = await supabase
      .from('inmates')
      .select('county');

    if (error) throw error;

    // Filter unique counties manually
    const uniqueCounties = [...new Set((data || []).map((item: { county: string }) => item.county))];
    return uniqueCounties.sort();
  } catch (error) {
    console.error('Error fetching counties:', error);
    return [];
  }
}

// Function to delete all inmates from the database
export async function deleteAllInmates(): Promise<void> {
  try {
    console.log('Deleting all inmates from the database...');

    const { error } = await supabase
      .from('inmates')
      .delete()
      .neq('id', 'placeholder'); // This will delete all rows

    if (error) {
      console.error('Supabase error details:');
      throw error;
    }

    console.log('Successfully deleted all inmates from the database');
  } catch (error) {
    console.error('Error deleting inmates from Supabase:', error);
    throw error;
  }
} 