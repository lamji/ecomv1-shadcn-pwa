'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Company Info */}
            <div>
              <h3 className="mb-4 text-lg font-bold">ShopHub</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                Your one-stop destination for the latest fashion trends and exclusive deals.
                Discover quality products at unbeatable prices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-base font-semibold tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-300 transition-colors hover:text-white">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 transition-colors hover:text-white">
                    Flash Sale
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 transition-colors hover:text-white">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 transition-colors hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 transition-colors hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            {/* Customer Service */}
            <div>
              <h4 className="mb-4 text-base font-semibold tracking-wider uppercase">
                Customer Service
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-300">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>1-800-SHOP-HUB</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>support@shophub.com</span>
                </li>
                <li className="flex items-center text-gray-300">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>123 Fashion Street, NY 10001</span>
                </li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" className="bg-primary hover:bg-primary/90 text-white">
                  Track Order
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">© {currentYear} ShopHub. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Shipping Policy
              </a>
              <a href="#" className="transition-colors hover:text-white">
                Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
