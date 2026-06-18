"use client";

import { VictoryLoader } from "@/components/victory-loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    RefreshCw,
    Send,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Activity,
    Users
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { useData } from "@/context/DataContext";

interface HistoryData {
    date: string;
    sent: number;
    inbox: number;
    spam: number;
}

interface WarmupData {
    email: string;
    total_sent: number;
    landed_inbox: number;
    landed_spam: number;
    received: number;
    health_score: number;
    health_label: string;
    inbox_rate: number;
    spam_rate: number;
    status: "Healthy" | "Medium" | "Poor";
    history?: HistoryData[];
}

export default function EmailAnalyticsPage() {
    const { leads: allLeads, loadingLeads } = useData();
    const [warmupData, setWarmupData] = useState<WarmupData[]>([]);
    const [generalData, setGeneralData] = useState<any>(null);
    const [loadingLocal, setLoadingLocal] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const loading = loadingLocal || loadingLeads;

    const fetchData = async (start?: Date, end?: Date) => {
        setLoadingLocal(true);
        setError(null);
        try {
            const startDate = start ? start.toISOString().split('T')[0] : '';
            const endDate = end ? end.toISOString().split('T')[0] : '';

            const warmupRes = await fetch('/api/email/warmup-analytics', { method: 'POST' });
            let warmupJson = [];
            if (warmupRes.ok) warmupJson = await warmupRes.json();

            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('start_date', startDate);
            if (endDate) queryParams.append('end_date', endDate);
            const generalRes = await fetch(`/api/email/analytics?${queryParams.toString()}`);
            let generalJson = null;
            if (generalRes.ok) generalJson = await generalRes.json();

            setWarmupData(warmupJson);
            setGeneralData(generalJson);
        } catch (e: any) {
            console.error("Analytics fetch error", e);
            setError(e.message);
        } finally {
            setLoadingLocal(false);
        }
    };

    useEffect(() => { fetchData(dateRange?.from, dateRange?.to); }, [allLeads, loadingLeads]);

    const handleDateUpdate = ({ range }: { range: DateRange | undefined }) => {
        setDateRange(range);
        if (range?.from && range?.to) fetchData(range.from, range.to);
    };

    const leadStats = useMemo(() => {
        if (loadingLeads) return { totalSent: 0, totalReplies: 0, totalUnsubscribed: 0, totalLeads: 0 };
        const start = dateRange?.from;
        const end = dateRange?.to;

        const filtered = allLeads.filter(lead => {
            let hasEmail = false;
            for (let i = 1; i <= 10; i++) {
                if (lead[`Email_${i}`] || lead.stage_data?.[`Email_${i}`]) { hasEmail = true; break; }
            }
            if (!hasEmail && !lead.email_replied) return false;
            const dateRef = lead.last_contacted || lead.updated_at || lead.created_at;
            if (!dateRef) return false;
            const leadDate = new Date(dateRef);
            if (start && leadDate < start) return false;
            if (end) { const toDate = new Date(end); toDate.setHours(23, 59, 59, 999); if (leadDate > toDate) return false; }
            return true;
        });

        let sent = 0, replies = 0, unsubscribed = 0;
        filtered.forEach(lead => {
            for (let i = 1; i <= 10; i++) {
                const val = lead[`Email_${i}`] || lead.stage_data?.[`Email_${i}`];
                if (val && String(val).trim() !== "" && String(val).toLowerCase() !== "no") sent++;
            }
            const isReplied = lead.email_replied && String(lead.email_replied).toLowerCase() !== "no" && String(lead.email_replied).toLowerCase() !== "none";
            if (isReplied) replies++;
            const isUnsub = lead.unsubscribed && String(lead.unsubscribed).toLowerCase().includes("yes");
            if (isUnsub) unsubscribed++;
        });

        return { totalSent: sent, totalReplies: replies, totalUnsubscribed: unsubscribed, totalLeads: filtered.length };
    }, [allLeads, loadingLeads, dateRange]);

    let totalDelivered = 0, totalOpens = 0, totalClicks = 0;
    if (generalData) {
        const dataArray = Array.isArray(generalData) ? generalData : (generalData.data || []);
        if (dataArray.length > 0) {
            dataArray.forEach((day: any) => {
                totalDelivered += (Number(day.total_delivered) || Number(day.delivered) || 0);
                totalOpens += (Number(day.total_opens) || Number(day.opens) || 0);
                totalClicks += (Number(day.total_clicks) || Number(day.clicks) || 0);
            });
        } else if (typeof generalData === 'object') {
            totalDelivered = Number(generalData.total_delivered) || Number(generalData.delivered) || 0;
            totalOpens = Number(generalData.total_opens) || Number(generalData.opens) || 0;
            totalClicks = Number(generalData.total_clicks) || Number(generalData.clicks) || 0;
        }
    }

    const { totalSent, totalReplies, totalUnsubscribed, totalLeads } = leadStats;
    const replyRate = totalLeads > 0 ? ((totalReplies / totalLeads) * 100).toFixed(2) : "0.00";

    return (
        <div className="space-y-6 pb-10 relative min-h-[500px]">
            {/* Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 'var(--ls-heading)', color: 'var(--label-primary)' }}>Email Analytics</h1>
                    <p style={{ fontSize: 13, color: 'var(--label-secondary)', marginTop: 2 }}>Comprehensive campaign and warm-up performance</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DateRangePicker onUpdate={handleDateUpdate} />
                    <button
                        onClick={() => fetchData(dateRange?.from, dateRange?.to)}
                        disabled={loading}
                        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', background: 'var(--fill-tertiary)', color: 'var(--label-secondary)', cursor: 'default', opacity: loading ? 0.6 : 1 }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--fill-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--fill-tertiary)')}
                    >
                        <RefreshCw style={{ width: 14, height: 14, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    </button>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle style={{ width: 14, height: 14 }} />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Campaign Performance */}
            <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-primary)', marginBottom: 10 }}>Campaign Performance</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard label="Total Sent" value={totalSent.toLocaleString()} icon={Send} color="var(--blue)" />
                    <MetricCard label="Replies" value={totalReplies.toLocaleString()} subtext={`${replyRate}% Rate`} icon={TrendingUp} color="var(--blue)" />
                    <MetricCard label="Unsubscribed" value={totalUnsubscribed.toLocaleString()} icon={AlertTriangle} color="var(--orange)" />
                    <MetricCard label="Total Leads" value={totalLeads.toLocaleString()} icon={Users} color="var(--label-secondary)" />
                </div>
            </div>

            {/* Warm-up Health */}
            <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-primary)', marginBottom: 10 }}>Warm-up Health</p>
                {!loading && warmupData.length === 0 && !error && (
                    <Alert>
                        <AlertCircle style={{ width: 14, height: 14 }} />
                        <AlertTitle>No Warm-up Data</AlertTitle>
                        <AlertDescription>No warm-up data found for the configured emails.</AlertDescription>
                    </Alert>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {warmupData.map((account) => (
                        <div key={account.email} className="liquid-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Account header */}
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--hairline)', background: 'var(--fill-quaternary)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(10,132,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>
                                        {account.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--label-primary)' }}>{account.email}</h3>
                                        <p style={{ fontSize: 11, color: 'var(--label-tertiary)' }}>Warm-up Status</p>
                                    </div>
                                </div>
                                <StatusBadge status={account.status} score={account.health_score} />
                            </div>

                            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    <MiniMetric label="Health Score" value={`${account.health_score}/100`} subtext={account.health_label} icon={Activity} color="var(--purple)" />
                                    <MiniMetric label="Inbox Rate" value={`${account.inbox_rate}%`} icon={CheckCircle2} color="var(--green)" />
                                    <MiniMetric label="Spam Rate" value={`${account.spam_rate}%`} icon={AlertTriangle} color="var(--red)" />
                                    <MiniMetric label="Warmup Sent" value={account.total_sent} icon={Send} color="var(--blue)" />
                                    <MiniMetric label="Landed Inbox" value={account.landed_inbox} icon={ShieldCheck} color="var(--green)" />
                                    <MiniMetric label="Landed Spam" value={account.landed_spam} icon={AlertCircle} color="var(--orange)" />
                                </div>

                                {account.history && account.history.length > 0 ? (
                                    <div style={{ height: 360, width: '100%' }}>
                                        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--label-tertiary)', marginBottom: 10 }}>Daily Performance</p>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={account.history} margin={{ top: 20, right: 60, left: 10, bottom: 30 }}>
                                                <defs>
                                                    <linearGradient id={`colorInbox-${account.email}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#30D158" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id={`colorSent-${account.email}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(127,127,127,0.1)" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--label-tertiary)' }}
                                                    tickFormatter={(str) => { const d = new Date(str); return `${d.getMonth() + 1}/${d.getDate()}`; }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--label-tertiary)' }} />
                                                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--hairline)', background: 'var(--bg-layer1)', fontSize: 11, color: 'var(--label-primary)', boxShadow: 'var(--shadow-lg)' }} />
                                                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--label-secondary)' }} />
                                                <Area type="monotone" dataKey="sent" name="Emails Sent" stroke="#0A84FF" fillOpacity={1} fill={`url(#colorSent-${account.email})`} strokeWidth={2} />
                                                <Area type="monotone" dataKey="inbox" name="Landed in Inbox" stroke="#30D158" fillOpacity={1} fill={`url(#colorInbox-${account.email})`} strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--fill-quaternary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--hairline)' }}>
                                        <p style={{ fontSize: 12, color: 'var(--label-tertiary)' }}>No historical data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading && <VictoryLoader fullScreen={false} />}
        </div>
    );
}

function StatusBadge({ status, score }: { status: string, score: number }) {
    let bg = 'var(--fill-tertiary)', color = 'var(--label-secondary)';
    if (status === "Healthy") { bg = 'rgba(48,209,88,0.12)'; color = 'var(--green)'; }
    else if (status === "Medium") { bg = 'rgba(255,159,10,0.12)'; color = 'var(--orange)'; }
    else if (status === "Poor") { bg = 'rgba(255,69,58,0.10)'; color = 'var(--red)'; }

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, background: bg, color }}>
            {status} ({score}%)
        </span>
    );
}

function MiniMetric({ label, value, subtext, icon: Icon, color }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--fill-quaternary)', border: '1px solid var(--hairline)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--label-tertiary)', fontWeight: 700 }}>{label}</span>
                <div style={{ padding: 4, borderRadius: '50%', background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
                    <Icon style={{ width: 10, height: 10 }} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--label-primary)', letterSpacing: 'var(--ls-metric)' }}>{value}</span>
                {subtext && <span style={{ fontSize: 10, color: 'var(--label-tertiary)' }}>{subtext}</span>}
            </div>
        </div>
    );
}

function MetricCard({ label, value, subtext, icon: Icon, color }: any) {
    return (
        <div className="liquid-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--label-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                <div style={{ padding: 6, borderRadius: 'var(--radius-sm)', background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}>
                    <Icon style={{ width: 13, height: 13 }} />
                </div>
            </div>
            <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--label-primary)', letterSpacing: 'var(--ls-metric)' }}>{value}</h3>
                {subtext && <p style={{ fontSize: 11, color: 'var(--label-secondary)', marginTop: 2 }}>{subtext}</p>}
            </div>
        </div>
    );
}
