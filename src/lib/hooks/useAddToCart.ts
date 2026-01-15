'use client';

import { Product } from '@/lib/data/products';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { setTemporaryCart } from '@/lib/features/cart';

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) return true;
    
    // Split token and get payload part
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration (exp is in seconds since epoch)
    if (!payload.exp) return true; // No expiration claim
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Assume expired if can't validate
  }
};

export const useAddToCart = () => {
  const profile = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();
  const router = useRouter();

  
  const addToCartHandler = (product: Product, quantity: number = 1) => {
    // Save product to Redux temporarily
    dispatch(setTemporaryCart({
      product: {
        id: product.id,
        name: product.title,
        price: product.price,
      },
      quantity,
    }));
    
    // Check if user is logged in and token is not expired
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // Check if phones and addresses arrays are not empty
    const hasPhones = profile.profile?.phones && profile.profile.phones.length > 0;
    const hasAddresses = profile.profile?.addresses && profile.profile.addresses.length > 0;
    const canAddToCart = hasPhones && hasAddresses;
    
    if(!token || isTokenExpired(token)){
      // Clear expired token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      router.push("/login");
      return;
    }else {
    // Redirect to profile page if cannot add to cart
      if (!canAddToCart) {
        router.push('/update-profile');
      }else{
        alert('Product added to cart successfully!');
      }
    }
   
  };

  return {
    addToCart: addToCartHandler,
  };
};
