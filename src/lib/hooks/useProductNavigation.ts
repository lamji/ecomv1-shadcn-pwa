import { useRouter } from 'next/navigation';

// Helper function to generate product ID from title
const generateProductId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Custom hook for product navigation
export const useProductNavigation = () => {
  const router = useRouter();

  const navigateToProduct = (title: string) => {
    const productId = generateProductId(title);
    router.push(`/product/${productId}`);
  };

  return { navigateToProduct };
};
