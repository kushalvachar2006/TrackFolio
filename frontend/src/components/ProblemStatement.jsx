import { motion } from "framer-motion";
import { AlertCircle, Phone, BarChart3 } from "lucide-react";
import "./ProblemStatement.css";

const painPoints = [
  {
    icon: AlertCircle,
    title: "Resume Chaos",
    description:
      "You have resume_final.pdf, resume_v2.pdf, resume_NEW.pdf and you don't know which is which.",
  },
  {
    icon: Phone,
    title: "The Recruiter Panic",
    description:
      "A recruiter calls. Your mind goes blank. You can't remember which version you sent them — or if you even applied.",
  },
  {
    icon: BarChart3,
    title: "Zero Visibility",
    description:
      "No idea how many places you've applied, what's pending, or what's ghosted you.",
  },
];

export const ProblemStatement = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="problem-section" id="for-students">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="section-eyebrow" variants={itemVariants}>
            THE STRUGGLE IS REAL
          </motion.div>

          <motion.h2 className="section-heading" variants={itemVariants}>
            Every student applying for jobs knows this pain.
          </motion.h2>

          <motion.div className="pain-points-grid" variants={containerVariants}>
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                className="pain-card"
                variants={itemVariants}
              >
                <div className="pain-icon"><point.icon size={22} /></div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};