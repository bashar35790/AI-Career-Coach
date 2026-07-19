export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">About AI Career Coach</h1>
      <div className="space-y-4 text-text-muted leading-relaxed">
        <p>
          AI Career Coach is your intelligent career development platform. We combine the power of
          GPT-4o with proven career coaching methodologies to help you land your dream job.
        </p>
        <p>
          Our platform offers AI-powered resume analysis, cover letter generation, interview
          preparation, personalized career roadmaps, and a smart career chat assistant — all in one place.
        </p>
        <p>
          Whether you&apos;re a fresh graduate entering the job market or an experienced professional
          looking to pivot, AI Career Coach provides the tools and guidance you need to succeed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="p-4 rounded-xl bg-surface-muted border border-border text-center">
            <div className="text-2xl font-bold text-primary">AI-Powered</div>
            <p className="text-sm mt-1">Advanced GPT-4o technology</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-muted border border-border text-center">
            <div className="text-2xl font-bold text-primary">Free to Start</div>
            <p className="text-sm mt-1">No credit card required</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-muted border border-border text-center">
            <div className="text-2xl font-bold text-primary">Career Focused</div>
            <p className="text-sm mt-1">Built by career professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
