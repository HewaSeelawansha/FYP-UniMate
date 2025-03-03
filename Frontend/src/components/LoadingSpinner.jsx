import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-5 h-5 bg-green rounded-full"
            animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
