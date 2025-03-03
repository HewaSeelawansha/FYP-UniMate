import { motion } from "framer-motion";

const loadingAnimation = {
  y: [0, -10, 0],
  opacity: [1, 0.5, 1],
};

const transitionProps = (delay) => ({
  repeat: Infinity,
  duration: 0.8,
  ease: "easeInOut",
  delay,
});

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen" aria-label="Loading">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-5 h-5 bg-green-500 rounded-full"
            animate={loadingAnimation}
            transition={transitionProps(i * 0.15)}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;
