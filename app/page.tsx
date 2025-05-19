'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const router = useRouter();

  return (
    <div   className="flex flex-col gap-6 min-h-screen items-center justify-center px-4 bg-[url('https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80')] bg-cover bg-center text-gray-600">

      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-6 text-center"
      >
        🎁 Welcome to Wishlist!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-lg mb-10 text-center max-w-xl"
      >
          Your dream items, all in one place. Log in or create an account to get started!
      </motion.p>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex gap-6"
      >
        <button
          onClick={() => router.push('/login')}
          className="bg-white text-gray-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-600  hover:text-white transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-white  hover:text-gray-800 transition duration-300 transform hover:scale-105"
        >
          Signup
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
