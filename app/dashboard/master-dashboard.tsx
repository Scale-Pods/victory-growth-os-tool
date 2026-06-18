"use client";

import {
    Users, Mail, MessageCircle, Phone, TrendingUp, PieChart as PieChartIcon,
    Activity, Maximize2, Minimize2, X, Expand, Info, Wallet, LayoutDashboard, Mic
} from "lucide-react";
import {
    Tooltip as UITooltip, TooltipContent as UITooltipContent,
    TooltipProvider as UITooltipProvider, TooltipTrigger as UITooltipTrigger,
} from "@/components/ui/tooltip";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TotalRepliesView } from "@/components/dashboard/total-replies-view";
import { WhatsAppChatDetail } from "@/components/dashboard/whatsapp-chat-detail";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { subDays, startOfDay, endOfDay, format } from "date-fns";
import { VictoryLoader } from "@/components/victory-loader";
import { useData } from "@/context/DataContext";
import { MaqsamBalanceDetail } from "@/components/dashboard/maqsam-balance-detail";

/* ── Wallet Modal ── */
function WalletModal({ isOpen, onClose, type, details, calls }: any) {
    const { voiceBalance } = useData();
    const vapiAgentUsed = useMemo(() => {
        if (!calls || !Array.isArray(calls)) return 0;
        return calls.filter((c: any) => c.source === 'vapi').reduce((acc: number, call: any) => acc + (call.breakdown?.agent || 0), 0);
    }, [calls]);

    const elDetails = voiceBalance?.elevenlabs || (voiceBalance?.character_limit ? voiceBalance : null);

    const titles: Record<string, string> = {
        vapi: 'Vapi Wallet', elevenlabs: 'ElevenLabs Credits',
        maqsam: 'Maqsam Telephony', twilio: 'Twilio Account',
    };

    const accentColors: Record<string, string> = {
        vapi: '#0A84FF', elevenlabs: '#FF9F0A', maqsam: '#40CBE0', twilio: '#FF453A',
    };
    const accent = accentColors[type] || '#0A84FF';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={type === 'maqsam' ? "sm:max-w-[550px]" : "sm:max-w-[400px]"}>
                <DialogHeader>
                    <DialogTitle style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
                        {titles[type]}
                    </DialogTitle>
                </DialogHeader>
                <div style={{ paddingTop: 8 }}>
                    {type === 'vapi' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{
                                background: `${accent}0F`,
                                borderRadius: 16,
                                padding: '28px 24px',
                                textAlign: 'center',
                                outline: `1px solid ${accent}22`,
                                outlineOffset: -1,
                            }}>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--label-tertiary)', marginBottom: 8 }}>
                                    Vapi Credits Used
                                </div>
                                <div style={{ fontSize: 44, fontWeight: 300, letterSpacing: '-0.03em', color: accent, fontVariantNumeric: 'tabular-nums' }}>
                                    ${vapiAgentUsed.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}
                    {type === 'elevenlabs' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{
                                background: `${accent}0F`, borderRadius: 16, padding: '24px',
                                textAlign: 'center', outline: `1px solid ${accent}22`, outlineOffset: -1,
                            }}>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--label-tertiary)', marginBottom: 8 }}>
                                    Characters Remaining
                                </div>
                                <div style={{ fontSize: 40, fontWeight: 300, letterSpacing: '-0.03em', color: accent, fontVariantNumeric: 'tabular-nums' }}>
                                    {elDetails ? ((elDetails.character_limit - elDetails.character_count) || 0).toLocaleString() : '—'}
                                </div>
                            </div>
                        </div>
                    )}
                    {type === 'twilio' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{
                                background: `${accent}0F`, borderRadius: 16, padding: '24px',
                                textAlign: 'center', outline: `1px solid ${accent}22`, outlineOffset: -1,
                            }}>
                                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--label-tertiary)', marginBottom: 8 }}>
                                    Remaining Balance
                                </div>
                                <div style={{ fontSize: 40, fontWeight: 300, letterSpacing: '-0.03em', color: accent, fontVariantNumeric: 'tabular-nums' }}>
                                    {typeof details?.balance === 'number' ? `$${details.balance.toFixed(2)}` : '—'}
                                </div>
                            </div>
                        </div>
                    )}
                    {type === 'maqsam' && (
                        <MaqsamBalanceDetail initialBalance={details} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ── Liquid Glass Metric Tile ── */
function MetricTile({
    title, value, trend, trendDir = 'neutral', accentColor,
    icon, onClick, action, info,
}: {
    title: string;
    value: string;
    trend?: string;
    trendDir?: 'up' | 'down' | 'neutral';
    accentColor: string;
    icon: React.ReactNode;
    onClick?: () => void;
    action?: React.ReactNode;
    info?: string;
}) {
    const trendColors = { up: 'var(--green)', down: 'var(--red)', neutral: 'var(--label-secondary)' };

    return (
        <div
            className="metric-tile"
            style={{ '--tile-accent': accentColor, cursor: onClick ? 'default' : undefined } as any}
            onClick={onClick}
            onMouseEnter={e => {
                if (onClick) e.currentTarget.style.transform = 'translateY(-2px) scale(1.002)';
            }}
            onMouseLeave={e => {
                if (onClick) e.currentTarget.style.transform = '';
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span className="tile-label">{title}</span>
                    {info && (
                        <UITooltipProvider>
                            <UITooltip>
                                <UITooltipTrigger asChild>
                                    <div style={{ cursor: 'default', display: 'flex', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                                        <Info size={13} style={{ color: 'var(--label-tertiary)' }} />
                                    </div>
                                </UITooltipTrigger>
                                <UITooltipContent className="max-w-[240px]">
                                    <p style={{ fontSize: 12, lineHeight: 1.5 }}>{info}</p>
                                </UITooltipContent>
                            </UITooltip>
                        </UITooltipProvider>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {action}
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${accentColor}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: accentColor,
                    }}>
                        {icon}
                    </div>
                </div>
            </div>

            {/* Value */}
            <div className="tile-value tabular-nums">{value}</div>

            {/* Trend */}
            {trend && (
                <div className={`tile-trend ${trendDir}`}>
                    {trend}
                </div>
            )}
        </div>
    );
}

/* ── Custom Tooltip for Recharts ── */
function AppleTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'var(--glass-fill)',
            backdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid var(--glass-border)',
            borderRadius: 12,
            padding: '10px 14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        }}>
            <p style={{ fontSize: 12, color: 'var(--label-secondary)', marginBottom: 4, letterSpacing: '-0.01em' }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ fontSize: 14, fontWeight: 600, color: p.color || 'var(--label-primary)', letterSpacing: '-0.02em' }}>
                    {p.value?.toLocaleString()}
                </p>
            ))}
        </div>
    );
}

export default function MasterDashboard() {
    const [isRepliesModalOpen, setIsRepliesModalOpen] = useState(false);
    const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);
    const [chatLead, setChatLead] = useState<any | null>(null);
    const [dateRange, setDateRange] = useState<any>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });
    const [walletModal, setWalletModal] = useState<{ isOpen: boolean; type: 'vapi' | 'elevenlabs' | 'maqsam' | 'twilio' }>({
        isOpen: false, type: 'vapi',
    });

    const { masterMetrics, loadingMasterMetrics, refreshMasterMetrics, calls, maqsamBalance, twilioBalance } = useData();
    
    const walletChips = [
        { type: 'vapi' as const, icon: <Mic size={13} />, color: '#0A84FF' },
        { type: 'elevenlabs' as const, icon: <LayoutDashboard size={13} />, color: '#FF9F0A' },
        { type: 'twilio' as const, icon: <MessageCircle size={13} />, color: '#FF453A' },
        { type: 'maqsam' as const, icon: <Wallet size={13} />, color: '#40CBE0' },
    ];
    const router = useRouter();

    useEffect(() => {
        if (!dateRange?.from) return;
        refreshMasterMetrics({ from: dateRange.from, to: dateRange.to || dateRange.from });
    }, [dateRange, refreshMasterMetrics]);

    /* WA stats */
    const [waUniqueSent, setWaUniqueSent] = useState<number | null>(null);
    const [waReplies, setWaReplies] = useState<number | null>(null);
    const [waReplyLeads, setWaReplyLeads] = useState<any[]>([]);

    const fetchWaStats = useCallback(async (from: Date, to: Date) => {
        const fromISO = startOfDay(from).toISOString();
        const toISO = endOfDay(to).toISOString();
        const res = await fetch(`/api/whatsapp-leads?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`);
        if (!res.ok) return;
        const data = await res.json();
        const allLeadsWA: any[] = [...(data.nr_wf || []), ...(data.followup || []), ...(data.nurture || [])];
        const rangeFrom = startOfDay(from).getTime();
        const rangeTo = endOfDay(to).getTime();
        let unique = 0;
        const replied: any[] = [];
        allLeadsWA.forEach((lead: any) => {
            if (!lead["W.P_1"]) return;
            const wp1t = lead.wp1_parsed_date ? new Date(lead.wp1_parsed_date).getTime() : null;
            const lct = lead.whatsapp_last_contacted ? new Date(lead.whatsapp_last_contacted).getTime() : null;
            const inRange = (wp1t && wp1t >= rangeFrom && wp1t <= rangeTo) || (lct && lct >= rangeFrom && lct <= rangeTo) || (!wp1t && !lct);
            if (!inRange) return;
            unique++;
            const wp = lead.WP_Replied_track || lead["WP_Replied_track"];
            const hasReply = wp && String(wp).trim() && !['no', 'none'].includes(String(wp).trim().toLowerCase());
            if (hasReply) replied.push({ ...lead, id: lead["Lead ID"] || lead.id, name: lead["Name"] || lead.name || "Unknown", phone: lead["Phone"] || lead.phone || "", email: lead["Email"] || lead.email || "", WP_Replied_track: wp });
        });
        setWaUniqueSent(unique);
        setWaReplies(replied.length);
        setWaReplyLeads(replied);
    }, []);

    useEffect(() => {
        if (!dateRange?.from) return;
        fetchWaStats(dateRange.from, dateRange.to || dateRange.from);
    }, [dateRange, fetchWaStats]);

    const loading = loadingMasterMetrics;
    const acquisitionChartData = useMemo(() => {
        if (!masterMetrics?.leadsDaily?.length) return [];
        return masterMetrics.leadsDaily.map(d => ({
            name: format(new Date(d.date + 'T00:00:00'), 'MMM dd'),
            leads: d.leads,
        }));
    }, [masterMetrics]);

    const m = masterMetrics;
    const totalWaReplies = waReplies ?? m?.totalWaReplies ?? 0;
    const totalWaReachouts = waUniqueSent ?? m?.totalWaReachouts ?? 0;
    const replyRate = totalWaReachouts > 0 ? ((totalWaReplies / totalWaReachouts) * 100).toFixed(1) : '0';

    const serviceDistribution = [
        { name: 'Email', value: 0, color: 'var(--blue)' },
        { name: 'WhatsApp', value: totalWaReachouts, color: 'var(--green)' },
        { name: 'Voice', value: m?.totalVoiceCalls ?? 0, color: 'var(--purple)' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 40, position: 'relative', minHeight: 500 }}>
            {loading && <VictoryLoader />}

            {/* ── Page Header ── */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.022em', color: 'var(--label-primary)', marginBottom: 4 }}>
                        Master Overview
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--label-secondary)', letterSpacing: '-0.011em' }}>
                        Holistic view of all your marketing channels performance.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <DateRangePicker onUpdate={({ range }) => setDateRange(range)} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--fill-secondary)', padding: '6px 8px', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                        {walletChips.map(chip => (
                            <button
                                key={chip.type}
                                onClick={() => setWalletModal({ isOpen: true, type: chip.type })}
                                className="wallet-chip"
                                title={`View ${chip.type} wallet`}
                            >
                                <span style={{ color: chip.color }}>{chip.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Primary Metric Tiles ── */}
            <div className="metric-grid">
                <MetricTile
                    title="Total Leads"
                    value={loading ? '—' : (m?.totalLeads ?? 0).toLocaleString()}
                    trend={m?.oldestLeadDate ? `Since ${format(new Date(m.oldestLeadDate), 'MMM d')}` : 'All time'}
                    trendDir="neutral"
                    accentColor="var(--blue)"
                    icon={<Users size={17} />}
                    onClick={() => router.push('/dashboard/leads')}
                />
                <MetricTile
                    title="Emails Sent"
                    value="—"
                    trend="Real-time"
                    trendDir="neutral"
                    accentColor="var(--green)"
                    icon={<Mail size={17} />}
                    onClick={() => router.push('/dashboard/email/sent')}
                />
                <MetricTile
                    title="WhatsApp Reachouts"
                    value={loading ? '—' : totalWaReachouts.toLocaleString()}
                    trend="Real-time"
                    trendDir="neutral"
                    accentColor="var(--purple)"
                    icon={<MessageCircle size={17} />}
                    onClick={() => router.push('/dashboard/whatsapp/chat')}
                />
                <MetricTile
                    title="Voice Calls"
                    value={loading ? '—' : (m?.totalVoiceCalls ?? 0).toLocaleString()}
                    trend="Real-time"
                    trendDir="neutral"
                    accentColor="var(--orange)"
                    icon={<Activity size={17} />}
                    onClick={() => router.push('/dashboard/voice')}
                    info="Shows Normal calls containing US, UK, UAE, 1731 leads, and openhouse leads."
                />
                <MetricTile
                    title="Total Replies"
                    value={loading ? '—' : totalWaReplies.toLocaleString()}
                    trend={`${replyRate}% reply rate`}
                    trendDir="up"
                    accentColor="var(--indigo)"
                    icon={<Expand size={17} />}
                    onClick={() => setIsRepliesModalOpen(true)}
                    info="Reply rate = Total Replies ÷ Total WhatsApp Reachouts. Select 'Last 3 Months' for full history."
                    action={
                        <button
                            style={{ background: 'none', border: 'none', cursor: 'default', padding: 4, color: 'var(--label-tertiary)', display: 'flex' }}
                            onClick={e => { e.stopPropagation(); setIsRepliesExpanded(v => !v); }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--label-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--label-tertiary)')}
                        >
                            {isRepliesExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    }
                />
            </div>

            {/* ── Owner Leads Section ── */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: 'rgba(255,159,10,0.14)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--orange)',
                    }}>
                        <Users size={16} />
                    </div>
                    <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
                        Owner Leads
                    </h2>
                </div>
                <div className="metric-grid">
                    <MetricTile
                        title="Total Owner Leads"
                        value={loading ? '—' : (m?.totalOwnerLeads ?? 0).toLocaleString()}
                        trend="All time"
                        trendDir="neutral"
                        accentColor="var(--orange)"
                        icon={<Users size={17} />}
                    />
                    <MetricTile
                        title="WA Reachouts (Owner)"
                        value={loading ? '—' : (m?.ownerWaReachouts ?? 0).toLocaleString()}
                        trend="Real-time"
                        trendDir="neutral"
                        accentColor="var(--green)"
                        icon={<MessageCircle size={17} />}
                    />
                    <MetricTile
                        title="Voice Calls (Owner)"
                        value={loading ? '—' : (m?.ownerVoiceCalls ?? 0).toLocaleString()}
                        trend="Real-time"
                        trendDir="neutral"
                        accentColor="var(--blue)"
                        icon={<Phone size={17} />}
                        info="Derived from Vapi call logs for the 'owners' account."
                    />
                    <MetricTile
                        title="Replies (Owner)"
                        value={loading ? '—' : (m?.ownerWaReplies ?? 0).toLocaleString()}
                        trend="Real-time"
                        trendDir="neutral"
                        accentColor="var(--purple)"
                        icon={<MessageCircle size={17} />}
                    />
                </div>
            </div>

            {/* ── Expanded Replies ── */}
            {isRepliesExpanded && (
                <div
                    className="liquid-card"
                    style={{ padding: 24, animation: 'spring-in 280ms var(--ease-spring)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--label-primary)', marginBottom: 3 }}>
                                Total Replies Details
                            </h2>
                            <p style={{ fontSize: 13, color: 'var(--label-secondary)' }}>Detailed view of all replies</p>
                        </div>
                        <button
                            onClick={() => setIsRepliesExpanded(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 12px', borderRadius: 8,
                                background: 'var(--fill-tertiary)', border: 'none',
                                cursor: 'default', fontSize: 13, fontWeight: 500,
                                color: 'var(--label-secondary)',
                            }}
                        >
                            <X size={13} /> Close
                        </button>
                    </div>
                    <TotalRepliesView
                        leads={waReplyLeads}
                        dateRange={dateRange}
                        onViewLead={lead => { setIsRepliesExpanded(false); setChatLead(lead); }}
                    />
                </div>
            )}

            {/* ── Charts ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div className="charts-grid-2-1">
                    {/* Lead Acquisition Chart */}
                    <div className="liquid-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 9,
                                background: 'rgba(0,122,255,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--blue)',
                            }}>
                                <TrendingUp size={15} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
                                    Lead Acquisition
                                </h3>
                                <p style={{ fontSize: 12, color: 'var(--label-tertiary)' }}>Daily new leads</p>
                            </div>
                        </div>
                        <div style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={acquisitionChartData}>
                                    <defs>
                                        <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%"   stopColor="var(--blue)" stopOpacity={0.30} />
                                            <stop offset="75%"  stopColor="var(--blue)" stopOpacity={0.05} />
                                            <stop offset="100%" stopColor="var(--blue)" stopOpacity={0}    />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 6" stroke="var(--separator)" strokeWidth={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false} tickLine={false}
                                        tick={{ fontSize: 11, fill: 'var(--label-tertiary)', fontWeight: 500 }}
                                        dy={8}
                                    />
                                    <YAxis
                                        axisLine={false} tickLine={false}
                                        tick={{ fontSize: 11, fill: 'var(--label-tertiary)', fontWeight: 500 }}
                                    />
                                    <Tooltip content={<AppleTooltip />} />
                                    <Area
                                        type="monotone" dataKey="leads"
                                        stroke="var(--blue)" strokeWidth={2}
                                        fill="url(#gradLeads)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Response Performance Donut */}
                    <div className="liquid-card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 9,
                                background: 'rgba(175,82,222,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--purple)',
                            }}>
                                <PieChartIcon size={15} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.022em', color: 'var(--label-primary)' }}>
                                    Channel Mix
                                </h3>
                                <p style={{ fontSize: 12, color: 'var(--label-tertiary)' }}>Response performance</p>
                            </div>
                        </div>
                        <div style={{ height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceDistribution}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={80}
                                        paddingAngle={4} dataKey="value"
                                    >
                                        {serviceDistribution.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<AppleTooltip />} />
                                    <Legend
                                        iconType="circle" iconSize={8}
                                        wrapperStyle={{ fontSize: 12, color: 'var(--label-secondary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Replies Modal ── */}
            <Dialog open={isRepliesModalOpen} onOpenChange={setIsRepliesModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Total Replies — Detailed View</DialogTitle>
                    </DialogHeader>
                    <div style={{ paddingTop: 16 }}>
                        <TotalRepliesView
                            leads={waReplyLeads}
                            dateRange={dateRange}
                            onViewLead={lead => { setIsRepliesModalOpen(false); setChatLead(lead); }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── WhatsApp Chat Modal ── */}
            <Dialog open={!!chatLead} onOpenChange={open => { if (!open) setChatLead(null); }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-6 gap-0">
                    <DialogHeader className="sr-only"><DialogTitle>WhatsApp Chat</DialogTitle></DialogHeader>
                    {chatLead && (
                        <WhatsAppChatDetail
                            customerId={String(chatLead["Lead ID"] || chatLead.id || "")}
                            initialLead={chatLead}
                            onClose={() => setChatLead(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Wallet Modal ── */}
            <WalletModal isOpen={walletModal.isOpen} type={walletModal.type} onClose={() => setWalletModal({ ...walletModal, isOpen: false })} details={walletModal.type === 'twilio' ? twilioBalance : maqsamBalance} calls={calls} />
        </div>
    );
}
