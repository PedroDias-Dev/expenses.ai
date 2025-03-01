import { AnimatePresence, motion } from "framer-motion";

const SwitchTransition = ({
  state,
  transitionType,
  components,
}: {
  state: string | number;
  transitionType?: "x" | "y";
  components: {
    [key: string]: React.ReactNode;
  };
}) => {
  const motionComponent = ({
    key,
    children,
  }: {
    key: string | number;
    children: React.ReactNode;
  }) => (
    <motion.div
      key={key}
      initial={{ [transitionType || "y"]: 3, opacity: 0 }}
      animate={{ [transitionType || "y"]: 0, opacity: 1 }}
      exit={{ [transitionType || "y"]: -3, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );

  const getComponents = (state: string | number) => {
    return (
      <AnimatePresence mode="wait">
        {components[state] &&
          motionComponent({ key: state, children: components[state] })}
      </AnimatePresence>
    );
  };

  return <AnimatePresence mode="wait">{getComponents(state)}</AnimatePresence>;
};

export default SwitchTransition;
