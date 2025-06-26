import { useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const handleClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <motion.div
      className="mx-8 sm:mx-16 xl:mx-24 relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center mt-20 mb-8">
        <motion.div
          className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <motion.p
            animate={{
              x: [0, -5, 5, -5, 5, 0], // shake left and right
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            New: AI feature integrated
          </motion.p>
          <img src={assets.star_icon} alt="star" className="w-2.5" />
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Your own {" "}
          <motion.span
            className="text-primary"
            animate={{
              scale: [1, 1.15, 1],
              color: ["#5046e5", "#7c3aed", "#5046e5"],
              textShadow: [
                "0px 0px 0px #7c3aed",
                "0px 2px 16px #7c3aed",
                "0px 0px 0px #7c3aed"
              ]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            blogging
          </motion.span>{" "}
          <br />{" "}
          platform.
        </motion.h1>
        <motion.p
          className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your story
          starts right here.
        </motion.p>
        <motion.form
          onSubmit={handleSearch}
          className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for blogs"
            required
            className="w-full pl-4 outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </motion.form>
      </div>
      <div className="text-center">
        {input && (
          <motion.button
            onClick={handleClear}
            className="border font-light text-xs py-1 px-3 rounded-sm shadow-custom-sm cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
          >
            Clear Search
          </motion.button>
        )}
      </div>
      <motion.img
        src={assets.gradientBackground}
        alt="gradient-bg"
        className="absolute -top-50 -z-1 opacity-50"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
      />
    </motion.div>
  );
};

export default Header;
