'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, FileText, MessageSquare,
  Route, Target, Brain, ChevronDown, Star,
  Users, BookOpen, Award, Rocket, Zap,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

function useCountUp(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [end, duration, start]);

  return count;
}

const features = [
  { icon: FileText, title: 'AI Resume Analysis', desc: 'Get instant, actionable feedback on your resume using GPT-4o to land more interviews.' },
  { icon: FileText, title: 'Cover Letter Generator', desc: 'Generate tailored, professional cover letters for any job application in seconds.' },
  { icon: MessageSquare, title: 'Interview Preparation', desc: 'Practice with AI-generated questions tailored to your target role and industry.' },
  { icon: Route, title: 'Career Roadmaps', desc: 'Visual step-by-step roadmaps to guide you from where you are to your dream career.' },
  { icon: Brain, title: 'Smart Chat Assistant', desc: 'Get expert AI guidance on any career question, anytime you need it.' },
  { icon: Target, title: 'Skill Assessment', desc: 'Identify skill gaps and track your professional development over time.' },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free and set up your profile with your current skills and career goals.' },
  { num: '02', title: 'Upload Your Resume', desc: 'Upload your resume for AI-powered analysis and instant improvement suggestions.' },
  { num: '03', title: 'Explore AI Tools', desc: 'Use our suite of AI tools for interviews, cover letters, and career planning.' },
  { num: '04', title: 'Track & Grow', desc: 'Monitor your progress with analytics dashboards and smart skill tracking.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', text: 'The AI interview prep was incredibly realistic. I landed my dream job at Google after practicing with this tool.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Product Manager', text: 'The career roadmap feature helped me map out exactly what skills I needed to transition into product management.', rating: 5 },
  { name: 'Priya Patel', role: 'Data Scientist', text: 'My resume went from getting zero callbacks to landing multiple interviews after the AI improvement suggestions.', rating: 5 },
  { name: 'Alex Rivera', role: 'UX Designer', text: 'The cover letter generator saved me hours of work and the results were better than anything I could write myself.', rating: 5 },
];

const faqs = [
  { q: 'Is the platform free?', a: 'Yes! We offer a generous free tier with access to all core features. Premium plans with advanced analytics are coming soon.' },
  { q: 'How does the AI analysis work?', a: 'Our AI uses GPT-4o to analyze your resume, generate interview questions, and provide personalized career advice tailored to your industry.' },
  { q: 'Can I save my progress?', a: 'Absolutely. Your profile, resumes, conversation history, and career roadmaps are saved securely and accessible from any device.' },
  { q: 'Is my data secure?', a: 'We use industry-standard encryption (AES-256) and never share your personal data with third parties. Your privacy is our priority.' },
  { q: 'What formats are supported?', a: 'We support PDF, DOCX, and plain text formats for resume uploads. Our AI works with all major file types.' },
];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const usersCount = useCountUp(10000, 2000, statsVisible);
  const itemsCount = useCountUp(500, 1500, statsVisible);
  const reviewsCount = useCountUp(2500, 1800, statsVisible);

  return (
    <div className="flex flex-col">

      {/* ──────────────── Hero ──────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-950 px-4">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Development
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Your AI-Powered{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Career Coach
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Accelerate your career with AI-driven resume analysis, interview practice, cover letter generation,
            and personalized career roadmaps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-border text-text font-semibold rounded-xl hover:bg-zinc-800 hover:border-primary/30 transition-all"
            >
              Explore Tools
              <Rocket className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-text-muted"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-zinc-800"
                  />
                ))}
              </div>
              <span>Trusted by <strong className="text-text">10,000+</strong> professionals</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────── Stats ──────────────── */}
      <section ref={statsRef} className="py-16 px-4 bg-zinc-900 border-y border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {[
              { icon: Users, value: usersCount, label: 'Active Users', suffix: '+', color: 'text-primary' },
              { icon: BookOpen, value: itemsCount, label: 'Courses & Resources', suffix: '+', color: 'text-secondary' },
              { icon: Award, value: reviewsCount, label: 'Success Stories', suffix: '+', color: 'text-accent' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <s.icon className={`w-8 h-8 ${s.color} mx-auto mb-3`} />
                <div className={`text-4xl font-bold ${s.color}`}>
                  {s.value.toLocaleString()}
                  {s.suffix}
                </div>
                <div className="text-text-muted mt-2">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── Features ──────────────── */}
      <section className="py-24 px-4 bg-surface-muted">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Everything You Need
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">All-in-One Career Platform</h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
              Six powerful AI tools designed to accelerate every stage of your career journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-zinc-900 border border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────── How It Works ──────────────── */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              <Route className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
              Get started in minutes and see results in days.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />

            <div className="space-y-12">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative flex gap-8 items-start"
                >
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {s.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-text-muted mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── Testimonials ──────────────── */}
      <section className="py-24 px-4 bg-surface-muted">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">What Our Users Say</h2>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-900 rounded-2xl p-8 md:p-10 border border-border shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-lg text-text leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                    <p className="text-text-muted text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeTestimonial
                      ? 'bg-primary w-8'
                      : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── FAQ ──────────────── */}
      <section className="py-24 px-4 bg-zinc-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-text-muted">Everything you need to know about AI Career Coach.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-medium hover:bg-surface-muted transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-text-muted leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CTA ──────────────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Ready to Transform{' '}
            <span className="bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent">
              Your Career?
            </span>
          </h2>
          <p className="mt-6 text-lg text-text-muted max-w-xl mx-auto">
            Join thousands of professionals who are accelerating their careers with AI-powered tools.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-border text-text font-semibold rounded-xl hover:bg-zinc-800 hover:border-primary/30 transition-all"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
