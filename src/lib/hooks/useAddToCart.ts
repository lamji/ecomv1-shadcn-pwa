'use client';

import { Product } from '@/lib/data/products';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { setTemporaryCart } from '@/lib/features/cart';

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
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const isLoggedIn = !!token && !!profile.profile;
    
    // Check if phones and addresses arrays are not empty
    const hasPhones = profile.profile?.phones && profile.profile.phones.length > 0;
    const hasAddresses = profile.profile?.addresses && profile.profile.addresses.length > 0;
    const canAddToCart = isLoggedIn && hasPhones && hasAddresses;
    
    console.log('Cart validation:', {
      isLoggedIn,
      hasToken: !!token,
      hasProfile: !!profile.profile,
      hasPhones,
      hasAddresses,
      canAddToCart,
      phoneCount: profile.profile?.phones?.length || 0,
      addressCount: profile.profile?.addresses?.length || 0
    });
    
    if(!isLoggedIn){
      router.push("/login")
    }
    // Redirect to profile page if cannot add to cart
    if (!canAddToCart) {
      router.push('/update-profile');
    }
  };

  return {
    addToCart: addToCartHandler,
  };
};
