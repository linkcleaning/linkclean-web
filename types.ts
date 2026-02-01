
export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  id: number;
  author: string;
  location: string;
  content: string;
  rating: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
