export type Category =
  | 'ALL'
  | 'TEXTBOOKS'
  | 'ELECTRONICS'
  //   | 'CLOTHING'
  | 'FURNITURE'
  | 'KITCHENWARE'
  | 'FREE_STUFF'
  | 'OTHER';

export const CATEGORIES = [
  { label: 'All', value: 'ALL', icon: 'apps' },
  { label: 'Textbooks', value: 'TEXTBOOKS', icon: 'book-outline' },
  { label: 'Electronics', value: 'ELECTRONICS', icon: 'laptop-outline' },
  //   { label: 'Clothing', value: 'CLOTHING', icon: 'shirt-outline' },
  { label: 'Kitchenware', value: 'KITCHENWARE', icon: 'restaurant-outline' },
  { label: 'Furniture', value: 'FURNITURE', icon: 'bed-outline' },
  { label: 'Free Stuff', value: 'FREE_STUFF', icon: 'gift-outline' },
  { label: 'Other', value: 'OTHER', icon: 'cube-outline' },
];

// Then in your form:
// <select or dropdown> that maps CATEGORIES to options
