export interface SwitchWordItem {
  id: string;
  goal: string;
  phrase: string;
  category: string;
  subcategory?: string;
}

export interface CategoryStructure {
  name: string;
  subcategories: {
    name: string;
    items: SwitchWordItem[];
  }[];
}

export type ViewState = 'home' | 'favorites' | 'assistant' | 'chant';

export interface ChantSession {
  item: SwitchWordItem;
  count: number;
  target: number;
  startTime: number;
}