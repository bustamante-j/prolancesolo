'use client';

import Link from 'next/link';
import { CheckCircle, Clock, TrendingUp, Users, ArrowRight, Star, Zap, Target, Shield, BarChart3, Calendar, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* floating decorative blobs */}
        <div className="absolute -left-32 -top-20 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 opacity-30 rounded-full filter blur-3xl animate-prolance-float" />
        <div className="absolute -right-32 -bottom-24 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-30 rounded-full filter blur-3xl animate-prolance-float animation-delay-2" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 hero-badge">
            <Zap className="w-4 h-4 mr-2" />
            Smart Freelance Management Platform
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight hero-title">
            <span className="block">ProLance</span>
            <span className="block text-4xl md:text-5xl font-medium text-indigo-200 hero-sub">Lite</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed hero-desc">
            Transform your freelance career with AI-powered task management, intelligent income tracking, and productivity tools designed specifically for independent professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 hero-ctas">
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hero-cta"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hero-cta-outline"
            >
              Explore Features
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-8 text-indigo-200 hero-stats">
            <div className="text-center">
              <div className="text-2xl font-bold text-white hero-count" data-target="10000">10K+</div>
              <div className="text-sm">Active Freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white hero-count" data-target="2000000">$2M+</div>
              <div className="text-sm">Income Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white hero-count" data-target="95">95%</div>
              <div className="text-sm">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Trusted by Leading Freelance Platforms
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Integrated with industry-standard tools and platforms
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Upwork</div>
            <div className="text-2xl font-bold text-gray-400">Fiverr</div>
            <div className="text-2xl font-bold text-gray-400">Freelancer.com</div>
            <div className="text-2xl font-bold text-gray-400">Toptal</div>
            <div className="text-2xl font-bold text-gray-400">99designs</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to streamline your freelance workflow and maximize your productivity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Smart Task Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-powered prioritization and intelligent deadline tracking keep you focused on what matters most.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Advanced Income Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Comprehensive financial dashboard with payment tracking, invoicing, and performance analytics.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Built-in Productivity Timer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Track time spent on tasks, calculate hourly rates, and optimize your work patterns automatically.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Client Relationship Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Maintain detailed client profiles, track payment behaviors, and nurture long-term relationships.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Focus Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Distraction-free environment with customizable timers to maintain deep concentration on tasks.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Smart Planning & Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                AI-driven daily planning with comprehensive analytics to optimize your workflow and productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to transform your freelance workflow
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Create Your Account
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Sign up with your email and start building your freelance workspace instantly.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Import Your Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Add your current tasks, set priorities, and let our AI optimize your workflow.
              </p>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Track & Scale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Monitor your progress, analyze performance, and grow your freelance business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Dashboard at Your Fingertips
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the most intuitive freelance management interface designed for productivity
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-white/80 text-sm mb-1">Active Tasks</div>
                    <div className="text-2xl font-bold text-white">12</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-white/80 text-sm mb-1">This Month</div>
                    <div className="text-2xl font-bold text-white">$4,250</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-white/80 text-sm mb-1">Focus Sessions</div>
                    <div className="text-2xl font-bold text-white">28</div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-white/80 text-sm mb-2">Recent Tasks</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-white">
                      <span>Website Redesign</span>
                      <span className="text-green-400">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Logo Design</span>
                      <span className="text-blue-400">Review</span>
                    </div>
                    <div className="flex items-center justify-between text-white">
                      <span>Mobile App UI</span>
                      <span className="text-yellow-400">Planning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Freelancers Choose ProLance Lite
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of successful freelancers who have transformed their businesses
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Boost Productivity by 40%
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Our AI-powered task prioritization and focus tools help you accomplish more in less time.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Secure & Private
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Enterprise-grade security with end-to-end encryption for all your sensitive data.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Never Miss Deadlines
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Smart reminders and deadline tracking ensure you always deliver on time.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Detailed Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Comprehensive insights into your work patterns, income trends, and client relationships.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Lightning Fast
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Optimized performance ensures you spend less time managing and more time creating.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    24/7 Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Dedicated support team ready to help you succeed with personalized assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Success Stories from Our Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real freelancers sharing their ProLance Lite experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                "ProLance Lite completely transformed my freelance business. The smart prioritization saved me 15+ hours per week, and the income tracking helped me increase my rates by 25%."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">SJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Sarah Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Senior Web Developer</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                "The focus mode is incredible. I used to struggle with distractions, but now I can deep-dive into complex projects for hours. My client satisfaction has never been higher."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Mike Chen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">UX/UI Designer</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg leading-relaxed">
                "As a content writer juggling multiple clients, ProLance Lite's client management and income tracking features are game-changers. I finally have full visibility into my business."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">ED</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Emma Davis</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Content Strategist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start free, upgrade when you're ready
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">$0<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Up to 10 tasks</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Basic time tracking</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">1 client profile</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center block"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white relative transform scale-105 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Unlimited tasks</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Unlimited clients</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-white text-indigo-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center block"
              >
                Start Pro Trial
              </Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-600">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">$29<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Team collaboration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Dedicated account manager</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Freelance Career?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join over 10,000 freelancers who have already boosted their productivity and income with ProLance Lite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-600 px-12 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
            >
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="text-indigo-200 text-sm">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
