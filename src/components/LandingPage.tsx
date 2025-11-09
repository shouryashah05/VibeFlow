import { motion } from 'framer-motion';
import type { ActiveWorkspaceTab } from '../types';

interface LandingPageProps {
  onGetStarted: (tab?: ActiveWorkspaceTab) => void;
}

type FeatureCardDescriptor = {
  title: string;
  description: string;
  icon: string;
  cta: string;
  tab: ActiveWorkspaceTab;
};

const featureCards: FeatureCardDescriptor[] = [
  {
    title: 'Visualize with VibeFlow',
    description: 'Understand project structure through interactive graphs, dependency maps, and effectful dashboards.',
    icon: '🧩',
    cta: 'Launch Visualizer',
    tab: 'visualize',
  },
  {
    title: 'Chat with Juries',
    description: 'Soon: let specialized AIs review architecture, quality, and delivery confidence in seconds.',
    icon: '🧑‍⚖️',
    cta: 'Preview the Verdict',
    tab: 'jury',
  },
];

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      <div className="relative overflow-hidden border-b border-slate-800"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a3f]/70 via-[#050505] to-[#090022]/70 blur-3xl" />
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt/40 via-transparent to-electric/30 blur-3xl" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 text-sm uppercase tracking-[0.45em] text-white"
          >
            Don’t just vibe code — build with flow.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-semibold leading-tight text-white drop-shadow-xl md:text-7xl"
          >
            VibeFlow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-3xl text-lg text-slate-300 md:text-xl"
          >
            The AI-powered visualization and reasoning companion for ambitious engineering teams. Upload your project, explore its DNA, and collaborate with intelligent agents built to keep you shipping fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <button className="button" onClick={() => onGetStarted()}>
              <div className="dots_border"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="sparkle"
              >
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                ></path>
                <path
                  className="path"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  stroke="black"
                  fill="black"
                  d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                ></path>
              </svg>
              <span className="text_button">Get Started</span>
              <div className="star-1">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
              <div className="star-2">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
              <div className="star-3">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
              <div className="star-4">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
              <div className="star-5">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
              <div className="star-6">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" version="1.1" style={{ shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd' }} viewBox="0 0 784.11 815.53" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Layer_x0020_1">
                    <path className="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"></path>
                  </g>
                </svg>
              </div>
            </button>
           
          </motion.div>
        </div>
      </div>

      <motion.section
        id="features"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="grid gap-12 md:grid-cols-3">
          {featureCards.map((feature) => (
            <div 
              key={feature.title} 
              className="vf-card3d-container cursor-pointer"
              onClick={() => onGetStarted(feature.tab)}
            >
              <div className="vf-card3d">
                <div className="vf-card3d-content">
                  <span className="vf-card3d-title">{feature.title}</span>
                  <p className="vf-card3d-text">{feature.description}</p>
                  <span className="vf-card3d-cta">{feature.cta}</span>
                </div>
                <div className="vf-card3d-badge" aria-hidden>
                  <span>{feature.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="border-t border-slate-800/60 bg-slate-950/40"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-16 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.45em] text-cobalt">Core Modes</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Flow through analysis, reasoning, and verdicts.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-300">
            Upload repos, parse dependencies, generate insights, and soon—debate design decisions with AI juries built to elevate your shipping velocity.
          </p>
        </div>
      </motion.section>
    </div>
  );
};
