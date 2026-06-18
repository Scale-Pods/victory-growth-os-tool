"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Mail, MessageCircle, Mic } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div
            className="min-h-screen overflow-hidden"
            style={{
                backgroundColor: '#0A0A0F',
                backgroundImage: `
                    radial-gradient(ellipse 140% 70% at 15% -10%, rgba(88,86,214,0.22) 0%, transparent 55%),
                    radial-gradient(ellipse 80% 60% at 85% 95%, rgba(10,132,255,0.16) 0%, transparent 50%),
                    radial-gradient(ellipse 60% 45% at 50% 40%, rgba(48,209,88,0.06) 0%, transparent 50%)
                `
            }}
        >
            {/* ── Header ── */}
            <header
                className="fixed top-0 w-full z-50"
                style={{
                    background: 'rgba(10,10,15,0.72)',
                    backdropFilter: 'blur(48px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(48px) saturate(180%)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-36 h-10">
                            <Image src="/VE-Logo-Color.svg" alt="Victory Energy" fill className="object-contain" priority />
                        </div>
                        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.40)', letterSpacing: '-0.01em' }}>
                            Powered by{' '}
                            <Image src="/scalepods-logo.avif" alt="ScalePods" width={60} height={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.60)',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'default',
                                letterSpacing: '-0.01em',
                                transition: 'color 130ms ease',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.90)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.60)')}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            style={{
                                padding: '9px 20px',
                                borderRadius: 10,
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#ffffff',
                                background: 'var(--blue, #0A84FF)',
                                border: 'none',
                                cursor: 'default',
                                letterSpacing: '-0.01em',
                                transition: 'opacity 150ms ease, transform 100ms ease',
                                boxShadow: '0 2px 8px rgba(10,132,255,0.35)',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <main className="pt-40 pb-24 px-6">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Pill */}
                    <div
                        className="inline-flex items-center gap-2 mb-8"
                        style={{
                            padding: '5px 14px',
                            borderRadius: 9999,
                            background: 'rgba(10,132,255,0.12)',
                            border: '1px solid rgba(10,132,255,0.22)',
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: '#40A0FF',
                        }}
                    >
                        <span
                            style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: '#0A84FF',
                                animation: 'pulse-live 2s ease-in-out infinite',
                                display: 'inline-block',
                            }}
                        />
                        Business Automation Platform
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontSize: 'clamp(44px, 7vw, 80px)',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.05,
                            color: 'rgba(255,255,255,0.96)',
                            marginBottom: 24,
                        }}
                    >
                        Automate Your<br />
                        <span style={{ color: '#0A84FF' }}>Business Growth</span>
                    </h1>

                    {/* Sub */}
                    <p
                        style={{
                            fontSize: 18,
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.46)',
                            maxWidth: 560,
                            margin: '0 auto 48px',
                            fontWeight: 400,
                            letterSpacing: '-0.011em',
                        }}
                    >
                        A complete suite of intelligent tools to capture leads and automate follow-ups.
                        Manage every channel from one powerful dashboard.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '14px 32px',
                            borderRadius: 14,
                            fontSize: 16,
                            fontWeight: 600,
                            color: '#ffffff',
                            background: 'var(--blue, #0A84FF)',
                            border: 'none',
                            cursor: 'default',
                            letterSpacing: '-0.01em',
                            boxShadow: '0 4px 16px rgba(10,132,255,0.40), 0 0 0 1px rgba(10,132,255,0.20)',
                            transition: 'opacity 150ms ease, transform 100ms ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                        onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                        Get Started Now
                        <ArrowRight size={16} />
                    </button>
                </div>

                {/* ── Feature Cards ── */}
                <div
                    className="max-w-5xl mx-auto mt-28 grid grid-cols-1 md:grid-cols-3 gap-5"
                >
                    {[
                        {
                            icon: <Mail size={22} />,
                            color: '#0A84FF',
                            title: 'Email Marketing',
                            description: 'Send bulk campaigns, track opens and clicks, and verify bounce rates. Integrate with Gmail for high-volume outreach with precision analytics.',
                        },
                        {
                            icon: <MessageCircle size={22} />,
                            color: '#30D158',
                            title: 'WhatsApp CRM',
                            description: 'Engage leads instantly with broadcast messages and organised chat lists. Track delivery, manage customer details, and automate replies 24/7.',
                        },
                        {
                            icon: <Mic size={22} />,
                            color: '#FF9F0A',
                            title: 'AI Voice Agents',
                            description: 'Deploy human-like AI assistants for inbound support and outbound sales. Auto-schedule meetings, verify leads, and analyse calls with sentiment.',
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                backdropFilter: 'blur(40px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                                borderRadius: 24,
                                padding: '28px 28px 32px',
                                outline: '1px solid rgba(255,255,255,0.07)',
                                outlineOffset: -1,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px) scale(1.003)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.26), 0 24px 56px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.10)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.20), 0 16px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)';
                            }}
                        >
                            {/* Ambient glow per card */}
                            <div
                                style={{
                                    position: 'absolute', top: -30, right: -30,
                                    width: 100, height: 100, borderRadius: '50%',
                                    background: card.color,
                                    opacity: 0.10,
                                    filter: 'blur(32px)',
                                    pointerEvents: 'none',
                                }}
                            />

                            <div
                                style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: `${card.color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: card.color,
                                    marginBottom: 20,
                                }}
                            >
                                {card.icon}
                            </div>

                            <h3
                                style={{
                                    fontSize: 18, fontWeight: 600,
                                    color: 'rgba(255,255,255,0.92)',
                                    letterSpacing: '-0.022em',
                                    marginBottom: 10,
                                }}
                            >
                                {card.title}
                            </h3>
                            <p
                                style={{
                                    fontSize: 14, lineHeight: 1.6,
                                    color: 'rgba(255,255,255,0.44)',
                                    letterSpacing: '-0.011em',
                                    fontWeight: 400,
                                }}
                            >
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Stats Strip ── */}
                <div
                    className="max-w-4xl mx-auto mt-20 grid grid-cols-3 gap-6"
                >
                    {[
                        { value: '3 Channels', label: 'Email · WhatsApp · Voice' },
                        { value: 'Real-time', label: 'Live metrics dashboard' },
                        { value: 'AI-Powered', label: 'Intelligent automation' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            style={{ textAlign: 'center', padding: '24px 20px' }}
                        >
                            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', color: 'rgba(255,255,255,0.88)', marginBottom: 6 }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.36)', letterSpacing: '-0.01em' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* ── Auth Modal ── */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultMode="login"
            />
        </div>
    );
}
