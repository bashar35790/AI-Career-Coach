export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-text-muted leading-relaxed text-sm">
        <h2 className="text-lg font-semibold text-text">1. Information We Collect</h2>
        <p>We collect information you provide directly, including your name, email address, resume content, and career preferences. We also collect usage data to improve our services.</p>

        <h2 className="text-lg font-semibold text-text">2. How We Use Your Information</h2>
        <p>Your information is used to provide AI-powered career coaching services, improve our platform, and send occasional service updates. We never sell your personal data.</p>

        <h2 className="text-lg font-semibold text-text">3. Data Storage & Security</h2>
        <p>Your data is stored securely using industry-standard encryption. We retain your data for as long as your account is active. You can request deletion at any time.</p>

        <h2 className="text-lg font-semibold text-text">4. AI Processing</h2>
        <p>Resume content and chat messages are processed by OpenAI GPT-4o for analysis and generation purposes. We do not use your content to train models.</p>

        <h2 className="text-lg font-semibold text-text">5. Third-Party Services</h2>
        <p>We use OpenAI for AI processing and MongoDB Atlas for database hosting. These providers have their own privacy and security measures.</p>

        <h2 className="text-lg font-semibold text-text">6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. Contact us at support@aicareercoach.com for assistance.</p>

        <p className="text-xs text-text-muted mt-8">Last updated: July 2026</p>
      </div>
    </div>
  );
}
