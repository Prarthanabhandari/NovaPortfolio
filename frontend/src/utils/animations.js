export const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

export const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
}