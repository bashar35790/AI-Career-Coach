'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      ref.current += increment;
      if (ref.current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(ref.current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);

  return count;
}

const features = [
  { title: 'AI Resume Analysis', desc: 'Get instant feedback and improvements on your resume using GPT-4o.' },
  { title: 'Cover Letter Generator', desc: 'Generate tailored cover letters for any job in seconds.' },
  { title: 'Interview Prep', desc: 'Practice with AI-generated interview questions for your target role.' },
  { title: 'Career Roadmaps', desc: 'Visual step-by-step roadmaps to reach your dream career.' },
  { title: 'Smart Chat Assistant', desc: 'Ask career-related questions and get expert AI guidance.' },
  { title: 'Skill Assessment', desc: 'Identify gaps and track your skill development over time.' },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up free and set up your profile with your current skills and goals.' },
  { num: '02', title: 'Upload Resume', desc: 'Upload your resume for AI analysis and instant improvement suggestions.' },
  { num: '03', title: 'Explore Tools', desc: 'Use our AI tools for interviews, cover letters, and career planning.' },
  { num: '04', title: 'Track Progress', desc: 'Monitor your growth with dashboards and skill tracking.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', text: 'The AI interview prep was incredibly realistic. I landed my dream job after practicing with this tool.' },
  { name: 'Marcus Johnson', role: 'Product Manager', text: 'The career roadmap feature helped me map out exactly what skills I needed to transition into product.' },
  { name: 'Priya Patel', role: 'Data Scientist', text: 'My resume went from getting zero callbacks to landing multiple interviews after the AI improvement.' },
];

const faqs = [
  { q: 'Is the platform free?', a: 'Yes! We offer a free tier with access to all core features. Premium plans are coming soon.' },
  { q: 'How does the AI analysis work?', a: 'Our AI uses GPT-4o to analyze your resume, generate interview questions, and provide personalized career advice.' },
  { q: 'Can I save my progress?', a: 'Absolutely. Your profile, resumes, and conversation history are saved securely and accessible anytime.' },
  { q: 'Is my data secure?', a: 'We use industry-standard encryption and never share your personal data with third parties.' },
];

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const usersCount = useCountUp(10000, 2000, statsVisible);
  const itemsCount = useCountUp(500, 1500, statsVisible);
  const reviewsCount = useCountUp(2500, 1800, statsVisible);

  return (
    <div className="flex flex-col">
      <section className="min-h-[65vh] py-16 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
        <div className="max-w-3xl text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight">
            Your AI-Powered{' '}
            <span className="text-primary">Career Coach</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto">
            Accelerate your career with AI-driven resume analysis, interview practice, cover letter generation,
            and personalized career roadmaps.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3 border border-border text-text font-semibold rounded-lg hover:bg-surface-muted transition-colors text-center"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <div className="w-5 h-5 rounded-full bg-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-text-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={statsRef} className="py-20 px-4 bg-surface-muted">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">{usersCount.toLocaleString()}+</div>
              <div className="text-text-muted mt-2">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">{itemsCount}+</div>
              <div className="text-text-muted mt-2">Courses & Resources</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent">{reviewsCount.toLocaleString()}+</div>
              <div className="text-text-muted mt-2">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {s.num}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-text-muted mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="bg-white rounded-2xl p-8 border border-border min-h-[180px] flex flex-col justify-center">
            <p className="text-lg text-text italic">&ldquo;{testimonials[activeTestimonial].text}&rdquo;</p>
            <div className="mt-6">
              <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
              <p className="text-text-muted text-sm">{testimonials[activeTestimonial].role}</p>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeTestimonial ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium hover:bg-surface-muted transition-colors"
                >
                  {faq.q}
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-text-muted text-sm">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-emerald-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead in Your Career</h2>
          <p className="text-text-muted mb-8">
            Get weekly tips, AI insights, and career advice delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
