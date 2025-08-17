"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductTechnology } from "@/types/catalog";

interface TechnologiesTabProps {
  technologies: ProductTechnology[];
}

export default function TechnologiesTab({ technologies }: TechnologiesTabProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Если нет технологий, показываем заглушку
  if (technologies.length === 0) {
    return (
      <div className="mt-8 p-8 text-center text-gray-500">
        Для данного продукта технологии не указаны
      </div>
    );
  }

  const handleTechClick = (techId: string) => {
    if (selectedTech === techId) {
      setSelectedTech(null);
    } else {
      setSelectedTech(techId);
    }
  };

  const handleClose = () => {
    setSelectedTech(null);
  };

  return (
    <motion.div
      className="mt-8 bg-white p-8 overflow-hidden "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-8">
        <AnimatePresence mode="wait">
          {selectedTech ? (
            <motion.div
              key="expanded"
              className="flex flex-row items-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {technologies.map((tech) => {
                const isSelected = tech.id.toString() === selectedTech;

                if (isSelected) {
                  return (
                    <motion.div
                      key={tech.id}
                      className="flex-1 px-4"
                      initial={{ width: "25%" }}
                      animate={{ width: "70%" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="relative">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <motion.div
                              className="uppercase font-medium text-sm mb-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.3 }}
                            >
                              {tech.name}
                            </motion.div>
                            <motion.h3
                              className="text-2xl font-medium mb-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              {tech.title}
                            </motion.h3>
                          </div>
                          <motion.button
                            onClick={handleClose}
                            className="p-1 hover:opacity-70 transition-opacity"
                            aria-label="Закрыть"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                          >
                            <X size={24} />
                          </motion.button>
                        </div>
                        <motion.p
                          className="text-base mb-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          {tech.description}
                        </motion.p>
                        <motion.div
                          className="w-full h-px bg-black mt-8"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  );
                } else {
                  return (
                    <motion.div
                      key={tech.id}
                      className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleTechClick(tech.id.toString())}
                      initial={{ width: "25%" }}
                      animate={{ width: "10%" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <motion.div
                        className="w-16 h-16 mb-2 flex items-center justify-center"
                        initial={{ scale: 1 }}
                        animate={{ scale: 0.8 }}
                        whileHover={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={tech.icon || "/placeholder.svg?height=60&width=60"}
                          alt={tech.name}
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                      </motion.div>
                      <motion.span
                        className="text-sm text-center"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ duration: 0.3 }}
                      >
                        {tech.name}
                      </motion.span>
                    </motion.div>
                  );
                }
              })}
            </motion.div>
          ) : (
            <motion.div
              key="default"
              className="flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {technologies.map((tech) => (
                <motion.div
                  key={tech.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleTechClick(tech.id.toString())}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="w-24 h-24 mb-3 flex items-center justify-center"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <Image
                      src={tech.icon || "/placeholder.svg?height=80&width=80"}
                      alt={tech.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </motion.div>
                  <motion.span className="text-base" whileHover={{ fontWeight: "500" }}>
                    {tech.name}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
