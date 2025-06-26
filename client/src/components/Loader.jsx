import React from "react";
import { motion } from "framer-motion";

const bounceTransition = {
  y: {
    duration: 0.6,
    yoyo: Infinity,
    ease: "easeInOut"
  },
  backgroundColor: {
    duration: 0.6,
    yoyo: Infinity,
    ease: "easeInOut"
  }
};

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex space-x-3">
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
            backgroundColor: ["#5046e5", "#7c3aed", "#5046e5"]
          }}
          transition={{ ...bounceTransition, delay: 0 }}
        />
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
            backgroundColor: ["#5046e5", "#7c3aed", "#5046e5"]
          }}
          transition={{ ...bounceTransition, delay: 0.2 }}
        />
        <motion.span
          className="block w-5 h-5 rounded-full bg-primary"
          animate={{
            y: [0, -20, 0],
            backgroundColor: ["#5046e5", "#7c3aed", "#5046e5"]
          }}
          transition={{ ...bounceTransition, delay: 0.4 }}
        />
      </div>
    </div>
  );
};

export default Loader;
