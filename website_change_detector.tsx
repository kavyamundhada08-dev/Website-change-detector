import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe, Clock, Bell, ShieldAlert, CheckCircle2, AlertTriangle, XCircle,
  Plus, Play, Eye, EyeOff, Layers, GitCompare, Sliders, Activity, Users,
  Zap, RefreshCw, Terminal, Mail, MessageSquare, Trash2, Code, FileText,
  Image as ImageIcon, Columns, Sparkles, Filter, Lock, Server, ArrowRight,
  ChevronRight, Search, Settings, HelpCircle, Check, Copy, ExternalLink
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_MONITORS = [
  {
    id: 'mon-1',
    name: 'Stripe API Pricing & Tiers',
    url: 'https://stripe.com/pricing',
    interval: '15 min',
    sensitivity: 2, // % change threshold
    subscribers: 248, // Demonstrates coalescing
    status: 'CHANGED', // OK, CHANGED, ERROR, BLOCKED
    lastChecked: '2 mins ago',
    lastChanged: '2 mins ago',
    watchSelectors: ['#pricing-table-main', '.enterprise-tier-card', '#transaction-fee-badge'],
    ignoreSelectors: ['.live-tx-counter', '#rotating-customer-banner', '.session-csrf-token', '.footer-timestamp'],
    noiseFilters: {
      stripTimestamps: true,
      stripTokens: true,
      hideAds: true,
      ignoreCounters: true,
      doubleFetchCalibration: true,
    },
    channels: { email: true, webhook: true, dailyDigest: false },
    domainBucket: 'stripe.com (1 req / 15m coalesced)',
    snapshots: [
      {
        id: 'snap-103',
        version: 'v3 (Latest)',
        timestamp: 'Today, 11:42:10 AM',
        hash: 'sha256:9f86d081884c7d659a2feaa0c55ad015',
        changePct: 4.8,
        summary: 'Standard card processing fee updated & new Volume tier added',
        textLines: [
          'Stripe Integrated Pricing',
          'Standard Plan: 2.7% + 25¢ per successful card charge',
          'New: Custom Volume discounts starting at $50k/mo',
          'ACH Direct Debit: 0.8% (capped at $5.00)',
          'International Cards: +1.5% fee',
          'Adaptive Acceptance included automatically'
        ],
        blocks: {
          headline: 'Pay as you go. No setup fees, no monthly fees.',
          priceMain: '2.7% + 25¢',
          priceSub: 'per successful card charge (Updated from 2.9% + 30¢)',
          tierNote: 'NEW: Automatic volume discounts unlocked at $50k/mo',
          counter: '14,982,104 API calls this minute',
          banner: 'Promo: Join Stripe Sessions 2026 in SF!',
          token: 'req_id: 99a8f-771b-00c2 | rendered: 11:42:10 UTC'
        }
      },
      {
        id: 'snap-102',
        version: 'v2',
        timestamp: 'Today, 08:15:00 AM',
        hash: 'sha256:4b227777d4dd1fc61c6f884f48641d02',
        changePct: 1.9,
        summary: 'International card surcharge text clarified',
        textLines: [
          'Stripe Integrated Pricing',
          'Standard Plan: 2.9% + 30¢ per successful card charge',
          'Custom packages available for large businesses',
          'ACH Direct Debit: 0.8% (capped at $5.00)',
          'International Cards: +1.5% fee',
          'Adaptive Acceptance included automatically'
        ],
        blocks: {
          headline: 'Pay as you go. No setup fees, no monthly fees.',
          priceMain: '2.9% + 30¢',
          priceSub: 'per successful card charge',
          tierNote: 'Custom packages available for businesses over $100k/mo',
          counter: '11,204,511 API calls this minute',
          banner: 'Read our 2026 Global Payments Report',
          token: 'req_id: 10b2c-449a-88e1 | rendered: 08:15:00 UTC'
        }
      },
      {
        id: 'snap-101',
        version: 'v1 (Baseline)',
        timestamp: 'Yesterday, 06:00:00 PM',
        hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb924',
        changePct: 0,
        summary: 'Initial baseline snapshot (Double-fetch calibrated)',
        textLines: [
          'Stripe Integrated Pricing',
          'Standard Plan: 2.9% + 30¢ per successful card charge',
          'Custom packages available for large businesses',
          'ACH Direct Debit: 0.8% (capped at $5.00)',
          'International Cards: +1.0% fee'
        ],
        blocks: {
          headline: 'Pay as you go. No setup fees, no monthly fees.',
          priceMain: '2.9% + 30¢',
          priceSub: 'per successful card charge',
          tierNote: 'Custom packages available for businesses over $100k/mo',
          counter: '9,012,884 API calls this minute',
          banner: 'Welcome to Stripe Pricing',
          token: 'req_id: 00a1f-112b-99d4 | rendered: 18:00:00 UTC'
        }
      }
    ]
  },
  {
    id: 'mon-2',
    name: 'NVIDIA RTX 5090 Founders Stock',
    url: 'https://marketplace.nvidia.com/en-us/consumer/graphics-cards/',
    interval: '15 min',
    sensitivity: 1,
    subscribers: 1420,
    status: 'BLOCKED',
    lastChecked: '4 mins ago',
    lastChanged: '2 days ago',
    statusDetail: 'Cloudflare Turnstile CAPTCHA detected (HTTP 403) — Alert Suppressed (Not treated as page change)',
    watchSelectors: ['#stock-status-badge', '.buy-now-button', '.retail-price-tag'],
    ignoreSelectors: ['.recommended-carousel', '#cookie-consent-banner', '.timestamp-footer'],
    noiseFilters: {
      stripTimestamps: true,
      stripTokens: true,
      hideAds: true,
      ignoreCounters: true,
      doubleFetchCalibration: true,
    },
    channels: { email: true, webhook: true, dailyDigest: false },
    domainBucket: 'marketplace.nvidia.com (1 req / 15m coalesced)',
    snapshots: [
      {
        id: 'snap-201',
        version: 'v1 (Baseline)',
        timestamp: '2 days ago, 04:12:00 PM',
        hash: 'sha256:7d865e959b2466918c9863afca942d0f',
        changePct: 0,
        summary: 'Initial baseline: Out of Stock ($1,999.00)',
        textLines: [
          'NVIDIA GeForce RTX 5090 Founders Edition',
          'Price: $1,999.00',
          'Status: Out of Stock',
          'Limit 1 per household'
        ],
        blocks: {
          headline: 'NVIDIA GeForce RTX 5090 Founders Edition',
          priceMain: '$1,999.00',
          priceSub: 'Status: OUT OF STOCK',
          tierNote: 'Limit 1 per customer. Verified Priority Access available.',
          counter: '4,892 shoppers viewing right now',
          banner: 'Bundle with GeForce NOW Ultimate',
          token: 'cf_ray: 891a22bc901_SJC'
        }
      }
    ]
  },
  {
    id: 'mon-3',
    name: 'OpenAI Status & Model Deprecations',
    url: 'https://platform.openai.com/docs/deprecations',
    interval: '1 hour',
    sensitivity: 5,
    subscribers: 89,
    status: 'OK',
    lastChecked: '14 mins ago',
    lastChanged: '5 days ago',
    watchSelectors: ['.deprecation-schedule-table', '#active-models-list'],
    ignoreSelectors: ['.feedback-widget', '.dynamic-build-hash'],
    noiseFilters: {
      stripTimestamps: true,
      stripTokens: true,
      hideAds: true,
      ignoreCounters: true,
      doubleFetchCalibration: true,
    },
    channels: { email: true, webhook: false, dailyDigest: true },
    domainBucket: 'platform.openai.com (1 req / 1h coalesced)',
    snapshots: [
      {
        id: 'snap-301',
        version: 'v1 (Baseline)',
        timestamp: '5 days ago, 10:00:00 AM',
        hash: 'sha256:2c26b46b68ffc68ff99b453c1d304134',
        changePct: 0,
        summary: 'No model deprecations announced in the last 5 days',
        textLines: [
          'OpenAI Platform Deprecations',
          'Legacy Completions API: Shutting down Q3',
          'All GPT-4o and o3 endpoints operating normally',
          'Recommended migration path documented below'
        ],
        blocks: {
          headline: 'Model Deprecation Schedule',
          priceMain: '0 Active Warnings',
          priceSub: 'All production endpoints healthy',
          tierNote: 'Next scheduled review: November 1, 2026',
          counter: 'Page build #88412',
          banner: 'Try the new Realtime API in Playground',
          token: 'trace_id: oai-doc-9918273'
        }
      }
    ]
  },
  {
    id: 'mon-4',
    name: 'USCIS Visa Bulletin Cutoff Dates',
    url: 'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html',
    interval: '6 hours',
    sensitivity: 1,
    subscribers: 615,
    status: 'ERROR',
    lastChecked: '19 mins ago',
    lastChanged: '18 days ago',
    statusDetail: 'HTTP 503 Service Unavailable (Origin Timeout after 3 retries w/ backoff) — Snapshot skipped',
    watchSelectors: ['#final-action-dates-table', '#dates-for-filing-table'],
    ignoreSelectors: ['#usa-gov-banner', '.last-updated-timestamp'],
    noiseFilters: {
      stripTimestamps: true,
      stripTokens: true,
      hideAds: true,
      ignoreCounters: true,
      doubleFetchCalibration: true,
    },
    channels: { email: true, webhook: true, dailyDigest: true },
    domainBucket: 'travel.state.gov (Polite Rate Limit: max 2 req/min)',
    snapshots: [
      {
        id: 'snap-401',
        version: 'v1 (Baseline)',
        timestamp: '18 days ago, 09:00:00 AM',
        hash: 'sha256:6b86b273ff34fce19d6b804eff5a3f57',
        changePct: 0,
        summary: 'October 2026 Visa Bulletin Final Action Dates published',
        textLines: [
          'Visa Bulletin For October 2026',
          'Employment-Based First Preference (EB-1): Current',
          'Employment-Based Second Preference (EB-2): 15JUL22',
          'Employment-Based Third Preference (EB-3): 01NOV21'
        ],
        blocks: {
          headline: 'Visa Bulletin For October 2026',
          priceMain: 'EB-1: Current',
          priceSub: 'EB-2 Cutoff: 15JUL22 | EB-3 Cutoff: 01NOV21',
          tierNote: 'USCIS determined Charts B may be used for filing this month.',
          counter: 'Visitor #991,201',
          banner: 'Official U.S. Department of State Website',
          token: 'gov_sess_id=881920041'
        }
      }
    ]
  }
];

const INITIAL_JOBS = [
  {
    id: 'job-904',
    monitorName: 'Stripe API Pricing & Tiers',
    url: 'https://stripe.com/pricing',
    coalescedUsers: 248,
    status: 'COMPLETED_CHANGED',
    attempt: '1/3',
    duration: '1,420ms',
    hashResult: 'Hash Changed (Δ 4.8% > 2% threshold) → Stored v3 & Dispatched 248 Alerts',
    timestamp: '2 mins ago'
  },
  {
    id: 'job-903',
    monitorName: 'NVIDIA RTX 5090 Founders Stock',
    url: 'https://marketplace.nvidia.com/...',
    coalescedUsers: 1420,
    status: 'BLOCKED_CAPTCHA',
    attempt: '2/3',
    duration: '2,180ms',
    hashResult: 'Detected Cloudflare Turnstile DOM (`#cf-challenge-running`) → Marked BLOCKED, No Diff Alert',
    timestamp: '4 mins ago'
  },
  {
    id: 'job-902',
    monitorName: 'OpenAI Status & Model Deprecations',
    url: 'https://platform.openai.com/docs/deprecations',
    coalescedUsers: 89,
    status: 'COMPLETED_UNCHANGED',
    attempt: '1/3',
    duration: '980ms',
    hashResult: 'Raw HTML differed (build hash + timestamp), Normalized SHA-256 identical → No Snapshot saved',
    timestamp: '14 mins ago'
  },
  {
    id: 'job-901',
    monitorName: 'USCIS Visa Bulletin Cutoff Dates',
    url: 'https://travel.state.gov/...',
    coalescedUsers: 615,
    status: 'FAILED_OUTAGE',
    attempt: '3/3 (Backoff: 2s, 4s, 8s)',
    duration: '15,000ms (Timeout)',
    hashResult: 'HTTP 503 Origin Error → Suppressed false-positive change alert, status set to ERROR',
    timestamp: '19 mins ago'
  }
];

// Visual Interactive Elements for the Visual Region Picker
const VISUAL_DOM_ELEMENTS = [
  {
    id: 'el-header',
    selector: '#pricing-header-hero',
    label: 'Hero Headline Banner',
    category: 'content',
    sampleContent: 'Pay as you go. No setup fees, no monthly fees, no hidden costs.',
    recommended: 'watch'
  },
  {
    id: 'el-banner',
    selector: '#rotating-customer-banner',
    label: 'Rotating Promo Ad / Marketing Banner',
    category: 'noise',
    sampleContent: '🔥 Promo: Register for Stripe Sessions 2026! (Rotates every page load)',
    recommended: 'ignore'
  },
  {
    id: 'el-pricing',
    selector: '#pricing-table-main',
    label: 'Core Card Processing Pricing Card',
    category: 'content',
    sampleContent: 'Integrated Plan: 2.7% + 25¢ per successful card charge',
    recommended: 'watch'
  },
  {
    id: 'el-enterprise',
    selector: '.enterprise-tier-card',
    label: 'Enterprise & Volume Discounts Box',
    category: 'content',
    sampleContent: 'Custom Volume discounts automatically unlocked starting at $50k/mo',
    recommended: 'watch'
  },
  {
    id: 'el-counter',
    selector: '.live-tx-counter',
    label: 'Live API Request Counter Ticker',
    category: 'noise',
    sampleContent: '⚡ Live Platform Activity: 14,982,104 API requests processed this minute',
    recommended: 'ignore'
  },
  {
    id: 'el-footer-token',
    selector: '.session-csrf-token',
    label: 'Dynamic Footer Timestamp & CSRF Session Token',
    category: 'noise',
    sampleContent: 'Rendered at 2026-10-16T11:42:10Z | Edge Node: IAD-52 | CSRF: 99a8f-771b-00c2',
    recommended: 'ignore'
  }
];

export default function App() {
  const [monitors, setMonitors] = useState(INITIAL_MONITORS);
  const [selectedMonitorId, setSelectedMonitorId] = useState('mon-1');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, picker, diff, architecture, queue
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [toast, setToast] = useState(null);

  // Add New Monitor Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newInterval, setNewInterval] = useState('15 min');
  const [newSensitivity, setNewSensitivity] = useState(2);
  const [newDigest, setNewDigest] = useState(false);

  // Visual Picker Mode State
  const [pickerMode, setPickerMode] = useState('watch'); // 'watch' or 'ignore'
  const [customSelectorInput, setCustomSelectorInput] = useState('');

  // Diff Viewer State
  const [diffMode, setDiffMode] = useState('text'); // 'text', 'visual', 'side-by-side'
  const [leftSnapIndex, setLeftSnapIndex] = useState(1); // Older version index
  const [rightSnapIndex, setRightSnapIndex] = useState(0); // Newer version index
  const [visualOverlayOpacity, setVisualOverlayOpacity] = useState(85);

  // Architecture Interactive Playground State
  const [simUsersCount, setSimUsersCount] = useState(200);
  const [rawHtmlInput, setRawHtmlInput] = useState(
    `<div class="price-card">Plan: $29/mo</div>\n<span class="timestamp">Rendered: 2026-10-16 11:44:09 UTC</span>\n<input type="hidden" name="csrf_token" value="a8f991bc772e" />\n<div class="live-counter">Active users: 1,492</div>`
  );

  const selectedMonitor = useMemo(
    () => monitors.find((m) => m.id === selectedMonitorId) || monitors[0],
    [monitors, selectedMonitorId]
  );

  // Ensure valid snapshot indices when changing monitors
  useEffect(() => {
    if (selectedMonitor.snapshots.length >= 2) {
      setRightSnapIndex(0);
      setLeftSnapIndex(1);
    } else {
      setRightSnapIndex(0);
      setLeftSnapIndex(0);
    }
  }, [selectedMonitorId, selectedMonitor.snapshots.length]);

  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // --- SIMULATION ACTIONS (RUN CHECK, SIMULATE CHANGE, CAPTCHA, OUTAGE, NOISE) ---
  const handleSimulateCheck = (monitorId, scenario) => {
    const target = monitors.find((m) => m.id === monitorId);
    if (!target) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (scenario === 'NOISE_ONLY') {
      const newJob = {
        id: `job-${Math.floor(1000 + Math.random() * 9000)}`,
        monitorName: target.name,
        url: target.url,
        coalescedUsers: target.subscribers,
        status: 'COMPLETED_UNCHANGED',
        attempt: '1/3',
        duration: '1,110ms',
        hashResult: `Stripped dynamic timestamp/tokens/counters → Normalized SHA-256 unchanged. 0 snapshots created.`,
        timestamp: 'Just now'
      };
      setJobs((prev) => [newJob, ...prev]);
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === monitorId
            ? { ...m, status: 'OK', lastChecked: 'Just now', statusDetail: 'Normalized content hash matched previous snapshot' }
            : m
        )
      );
      triggerToast(`Check complete for "${target.name}": Dynamic noise stripped, content hash unchanged!`, 'success');
    } else if (scenario === 'MEANINGFUL_CHANGE') {
      const newVersionNum = target.snapshots.length + 1;
      const randomFee = (2.1 + Math.random() * 0.7).toFixed(1);
      const newHash = `sha256:${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;

      const newSnap = {
        id: `snap-${Date.now()}`,
        version: `v${newVersionNum} (Latest)`,
        timestamp: `Today, ${nowTime}`,
        hash: newHash,
        changePct: 6.4,
        summary: `Detected pricing update in watched selector (${target.watchSelectors[0] || 'body'}): ${randomFee}% + 20¢`,
        textLines: [
          `${target.name} — Watched Region`,
          `Standard Plan: ${randomFee}% + 20¢ per successful card charge`,
          `New: Instant Payouts fee reduced to 0.5%`,
          `ACH Direct Debit: 0.8% (capped at $5.00)`,
          `International Cards: +1.5% fee`,
          `Adaptive Acceptance included automatically`
        ],
        blocks: {
          headline: 'Pay as you go. No setup fees, no monthly fees.',
          priceMain: `${randomFee}% + 20¢`,
          priceSub: `per successful card charge (Updated at ${nowTime})`,
          tierNote: 'NEW: Instant Payouts fee reduced to 0.5% for all tiers',
          counter: `${Math.floor(15000000 + Math.random() * 900000).toLocaleString()} API calls this minute`,
          banner: 'Promo: Join Stripe Sessions 2026!',
          token: `req_id: ${Math.random().toString(36).substring(2, 10)} | rendered: ${nowTime}`
        }
      };

      const updatedSnaps = [
        newSnap,
        ...target.snapshots.map((s, idx) => ({
          ...s,
          version: s.version.replace(' (Latest)', '')
        }))
      ];

      setMonitors((prev) =>
        prev.map((m) =>
          m.id === monitorId
            ? {
                ...m,
                status: 'CHANGED',
                lastChecked: 'Just now',
                lastChanged: 'Just now',
                statusDetail: `Content hash changed (Δ 6.4% > ${m.sensitivity}% sensitivity). Dispatched alert.`,
                snapshots: updatedSnaps
              }
            : m
        )
      );

      const newJob = {
        id: `job-${Math.floor(1000 + Math.random() * 9000)}`,
        monitorName: target.name,
        url: target.url,
        coalescedUsers: target.subscribers,
        status: 'COMPLETED_CHANGED',
        attempt: '1/3',
        duration: '1,390ms',
        hashResult: `New Hash (${newHash.slice(0, 15)}...) → Saved v${newVersionNum} & fanned out ${target.subscribers} notifications`,
        timestamp: 'Just now'
      };
      setJobs((prev) => [newJob, ...prev]);
      setSelectedMonitorId(monitorId);
      setRightSnapIndex(0);
      setLeftSnapIndex(1);
      triggerToast(`Meaningful change detected on "${target.name}"! Stored snapshot v${newVersionNum} & sent ${target.subscribers} coalesced alerts.`, 'alert');
    } else if (scenario === 'CAPTCHA') {
      const newJob = {
        id: `job-${Math.floor(1000 + Math.random() * 9000)}`,
        monitorName: target.name,
        url: target.url,
        coalescedUsers: target.subscribers,
        status: 'BLOCKED_CAPTCHA',
        attempt: '2/3',
        duration: '2,410ms',
        hashResult: `Anti-bot challenge detected (HTTP 403 / Cloudflare Turnstile) → Classified as BLOCKED, NOT a page diff!`,
        timestamp: 'Just now'
      };
      setJobs((prev) => [newJob, ...prev]);
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === monitorId
            ? {
                ...m,
                status: 'BLOCKED',
                lastChecked: 'Just now',
                statusDetail: 'CAPTCHA / Anti-bot challenge detected — False-positive diff alert suppressed'
              }
            : m
        )
      );
      triggerToast(`CAPTCHA challenge detected on "${target.name}". Status set to BLOCKED (false-positive change alert suppressed).`, 'warning');
    } else if (scenario === 'OUTAGE') {
      const newJob = {
        id: `job-${Math.floor(1000 + Math.random() * 9000)}`,
        monitorName: target.name,
        url: target.url,
        coalescedUsers: target.subscribers,
        status: 'FAILED_OUTAGE',
        attempt: '3/3 (Retried w/ backoff)',
        duration: '15,000ms',
        hashResult: `HTTP 502 Bad Gateway after 3 retries → Classified as ERROR, previous snapshot preserved`,
        timestamp: 'Just now'
      };
      setJobs((prev) => [newJob, ...prev]);
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === monitorId
            ? {
                ...m,
                status: 'ERROR',
                lastChecked: 'Just now',
                statusDetail: 'HTTP 502 Bad Gateway after 3 retries — Treated as site outage, not content change'
              }
            : m
        )
      );
      triggerToast(`Site Outage (HTTP 502) on "${target.name}". Retried 3x with backoff; marked as ERROR without overwriting snapshot.`, 'error');
    }
  };

  // --- ADD MONITOR WITH URL DEDUPLICATION / COALESCING ---
  const handleAddMonitor = (e) => {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim()) return;

    const normalizedNewUrl = newUrl.trim().toLowerCase().replace(/\/$/, '');
    const existingMonitor = monitors.find(
      (m) => m.url.toLowerCase().replace(/\/$/, '') === normalizedNewUrl
    );

    if (existingMonitor) {
      // Demonstrate URL Deduplication / Coalescing!
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === existingMonitor.id ? { ...m, subscribers: m.subscribers + 1 } : m
        )
      );
      setSelectedMonitorId(existingMonitor.id);
      setShowAddModal(false);
      setNewUrl('');
      setNewName('');
      triggerToast(
        `URL Coalesced! attached your subscription to existing fetch pool for ${existingMonitor.url} (${existingMonitor.subscribers + 1} watchers, 1 shared Playwright fetch).`,
        'success'
      );
      return;
    }

    const createdMonitor = {
      id: `mon-${Date.now()}`,
      name: newName.trim(),
      url: newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`,
      interval: newInterval,
      sensitivity: Number(newSensitivity),
      subscribers: 1,
      status: 'OK',
      lastChecked: 'Just now (Double-Fetch Calibrated)',
      lastChanged: 'Never (Baseline v1)',
      watchSelectors: ['main', '#primary-content'],
      ignoreSelectors: ['.timestamp', '.ad-banner', '.csrf-token'],
      noiseFilters: {
        stripTimestamps: true,
        stripTokens: true,
        hideAds: true,
        ignoreCounters: true,
        doubleFetchCalibration: true
      },
      channels: { email: true, webhook: true, dailyDigest: newDigest },
      domainBucket: `${new URL(newUrl.trim().startsWith('http') ? newUrl.trim() : `https://${newUrl.trim()}`).hostname} (Polite Token Bucket)`,
      snapshots: [
        {
          id: `snap-${Date.now()}`,
          version: 'v1 (Baseline)',
          timestamp: 'Just now',
          hash: 'sha256:8f14e45fceea167a5a36dedd4bea2543',
          changePct: 0,
          summary: 'Initial baseline snapshot captured via Playwright (Double-fetch calibrated)',
          textLines: [
            `${newName.trim()} — Watched Content`,
            'Primary Headline: Welcome to our public page',
            'Current Status: Active and available',
            'Pricing / Details: Standard Tier $49/mo'
          ],
          blocks: {
            headline: newName.trim(),
            priceMain: '$49.00 / mo',
            priceSub: 'Baseline captured via headless Chromium',
            tierNote: 'Double-fetch calibration removed 2 dynamic nodes automatically.',
            counter: '102 active sessions',
            banner: 'Sponsored Banner (Ignored)',
            token: 'session_token: calibrated_ignore'
          }
        }
      ]
    };

    setMonitors((prev) => [createdMonitor, ...prev]);
    setSelectedMonitorId(createdMonitor.id);
    setShowAddModal(false);
    setNewUrl('');
    setNewName('');
    triggerToast(`Created monitor "${createdMonitor.name}" with initial double-fetch baseline calibration!`, 'success');
  };

  // --- TOGGLE SELECTORS IN VISUAL PICKER ---
  const handleElementClickInPicker = (selector) => {
    setMonitors((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMonitor.id) return m;
        const inWatch = m.watchSelectors.includes(selector);
        const inIgnore = m.ignoreSelectors.includes(selector);

        if (pickerMode === 'watch') {
          const nextWatch = inWatch
            ? m.watchSelectors.filter((s) => s !== selector)
            : [...m.watchSelectors, selector];
          const nextIgnore = m.ignoreSelectors.filter((s) => s !== selector);
          return { ...m, watchSelectors: nextWatch, ignoreSelectors: nextIgnore };
        } else {
          const nextIgnore = inIgnore
            ? m.ignoreSelectors.filter((s) => s !== selector)
            : [...m.ignoreSelectors, selector];
          const nextWatch = m.watchSelectors.filter((s) => s !== selector);
          return { ...m, watchSelectors: nextWatch, ignoreSelectors: nextIgnore };
        }
      })
    );
  };

  const handleAddCustomSelector = (e) => {
    e.preventDefault();
    if (!customSelectorInput.trim()) return;
    handleElementClickInPicker(customSelectorInput.trim());
    setCustomSelectorInput('');
  };

  const toggleNoiseFilter = (key) => {
    setMonitors((prev) =>
      prev.map((m) =>
        m.id === selectedMonitor.id
          ? { ...m, noiseFilters: { ...m.noiseFilters, [key]: !m.noiseFilters[key] } }
          : m
      )
    );
  };

  // --- LINE-BY-LINE DIFF COMPUTATION ---
  const computedLineDiff = useMemo(() => {
    const snaps = selectedMonitor.snapshots;
    const newer = snaps[rightSnapIndex] || snaps[0];
    const older = snaps[leftSnapIndex] || snaps[snaps.length - 1];

    if (!newer || !older) return [];

    const oldLines = older.textLines || [];
    const newLines = newer.textLines || [];
    const diffResult = [];

    const maxLen = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLen; i++) {
      const oLine = oldLines[i];
      const nLine = newLines[i];
      if (oLine === nLine && oLine !== undefined) {
        diffResult.push({ type: 'unchanged', text: nLine, lineOld: i + 1, lineNew: i + 1 });
      } else {
        if (oLine !== undefined && !newLines.includes(oLine)) {
          diffResult.push({ type: 'removed', text: oLine, lineOld: i + 1, lineNew: null });
        }
        if (nLine !== undefined && !oldLines.includes(nLine)) {
          diffResult.push({ type: 'added', text: nLine, lineOld: null, lineNew: i + 1 });
        }
      }
    }
    return diffResult;
  }, [selectedMonitor, leftSnapIndex, rightSnapIndex]);

  // Normalized HTML live sanitizer for Architecture tab
  const normalizedHtmlOutput = useMemo(() => {
    return rawHtmlInput
      .replace(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s*UTC/gi, '[STRIPPED_TIMESTAMP]')
      .replace(/value="[a-zA-Z0-9_-]{8,}"/g, 'value="[STRIPPED_TOKEN]"')
      .replace(/Active users:\s*[\d,]+/gi, 'Active users: [IGNORED_COUNTER]');
  }, [rawHtmlInput]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> OK (No Change)
          </span>
        );
      case 'CHANGED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Changed
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Blocked / CAPTCHA
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Outage / Error
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 border border-indigo-500/50 shadow-2xl rounded-xl p-4 flex items-start gap-3 animate-bounce">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="text-sm text-slate-200 leading-relaxed flex-1">{toast.message}</div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">DiffPulse</h1>
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Playwright Headless Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Noise-Filtered Website Change Detector • Content-Hash Deduplication • Coalesced Fetching
              </p>
            </div>
          </div>

          {/* Global Metrics Pill Bar */}
          <div className="hidden lg:flex items-center gap-6 bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">Total Watchers:</span>
              <span className="font-bold text-white">
                {monitors.reduce((acc, m) => acc + m.subscribers, 0).toLocaleString()}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Coalesced Fetch Ratio:</span>
              <span className="font-bold text-emerald-400">
                {Math.round(monitors.reduce((acc, m) => acc + m.subscribers, 0) / monitors.length)}:1 Saved
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">False Alerts Suppressed:</span>
              <span className="font-bold text-purple-300">100% (CAPTCHA/5xx Isolated)</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Public URL Monitor
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/60 pt-1">
          {[
            { id: 'dashboard', label: '1. Monitors & Dashboard', icon: Globe },
            { id: 'picker', label: '2. Visual Selector Picker & Noise Filters', icon: Sliders },
            { id: 'diff', label: '3. Version Timeline & 3-Way Diff Viewer', icon: GitCompare },
            { id: 'architecture', label: '4. System Design & 4 Edge Cases', icon: Server },
            { id: 'queue', label: '5. Job Queue & Webhook Alerts', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-t-lg'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Active Target Selector Bar (Shared context across tabs) */}
      <div className="bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Active Target Page:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {monitors.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMonitorId(m.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2 transition cursor-pointer ${
                    selectedMonitor.id === m.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{m.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.status === 'OK'
                        ? 'bg-emerald-400'
                        : m.status === 'CHANGED'
                        ? 'bg-amber-400'
                        : m.status === 'BLOCKED'
                        ? 'bg-purple-400'
                        : 'bg-rose-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Instant Test Controls for Current Target */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">Simulate Headless Check:</span>
            <button
              onClick={() => handleSimulateCheck(selectedMonitor.id, 'MEANINGFUL_CHANGE')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Simulates a genuine content change exceeding sensitivity threshold"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Meaningful Change
            </button>
            <button
              onClick={() => handleSimulateCheck(selectedMonitor.id, 'NOISE_ONLY')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Simulates ad/timestamp/token change that gets filtered out so hash stays identical"
            >
              <Filter className="w-3.5 h-3.5" /> + Noise Only (Ignored)
            </button>
            <button
              onClick={() => handleSimulateCheck(selectedMonitor.id, 'CAPTCHA')}
              className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Simulates a Cloudflare CAPTCHA challenge page (Suppressed from diff alerts)"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> + CAPTCHA Block
            </button>
            <button
              onClick={() => handleSimulateCheck(selectedMonitor.id, 'OUTAGE')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Simulates HTTP 502 Outage (Retried 3x, marked Error, no false diff)"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> + 502 Outage
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Core Architecture Callout Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>PUBLIC PAGES MONITORED</span>
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">{monitors.length} Targets</div>
                <div className="text-xs text-slate-400 mt-1">
                  Headless Playwright • No stored credentials
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>HASH-ONLY SNAPSHOT STORAGE</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {monitors.reduce((acc, m) => acc + m.snapshots.length, 0)} Versions
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Saved only when normalized SHA-256 changes
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>COALESCED SUBSCRIBERS</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold text-cyan-400">
                  {monitors.reduce((acc, m) => acc + m.subscribers, 0).toLocaleString()} Users
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  200+ users watching 1 URL = 1 fetch per interval
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>OUTAGE & CAPTCHA GUARD</span>
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-300">Active</div>
                <div className="text-xs text-slate-400 mt-1">
                  5xx & CAPTCHAs isolated from content diffs
                </div>
              </div>
            </div>

            {/* Monitors Table / Cards */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Monitored Public Web Pages</h2>
                  <p className="text-xs text-slate-400">
                    Click any row to inspect its version timeline, visual CSS selectors, or trigger simulated checks.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" /> OK
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" /> Changed
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 ml-2" /> Blocked (CAPTCHA)
                  <span className="inline-block w-2 h-2 rounded-full bg-rose-400 ml-2" /> Error (5xx/Timeout)
                </div>
              </div>

              <div className="divide-y divide-slate-800/80">
                {monitors.map((mon) => {
                  const isSelected = mon.id === selectedMonitor.id;
                  const latestSnap = mon.snapshots[0];
                  return (
                    <div
                      key={mon.id}
                      onClick={() => setSelectedMonitorId(mon.id)}
                      className={`p-5 transition cursor-pointer ${
                        isSelected ? 'bg-indigo-950/25 border-l-4 border-l-indigo-500' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-bold text-base text-white">{mon.name}</span>
                            {getStatusBadge(mon.status)}
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              Every {mon.interval}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {mon.subscribers} coalesced watchers
                            </span>
                          </div>

                          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-slate-500" />
                            {mon.url}
                          </div>

                          {mon.statusDetail && (
                            <div
                              className={`text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-2 mt-1 ${
                                mon.status === 'BLOCKED'
                                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                                  : mon.status === 'ERROR'
                                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              <InfoBadge status={mon.status} />
                              {mon.statusDetail}
                            </div>
                          )}
                        </div>

                        {/* Metadata & Quick Actions */}
                        <div className="flex flex-wrap items-center gap-6 text-xs">
                          <div>
                            <div className="text-slate-500">Last Checked</div>
                            <div className="font-medium text-slate-200 mt-0.5">{mon.lastChecked}</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Last Changed</div>
                            <div className="font-medium text-amber-300 mt-0.5">{mon.lastChanged}</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Latest Content Hash</div>
                            <div className="font-mono text-slate-300 mt-0.5">
                              {latestSnap?.hash.slice(0, 19)}...
                            </div>
                          </div>

                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setSelectedMonitorId(mon.id);
                                setActiveTab('picker');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Selectors (
                              {mon.watchSelectors.length}/{mon.ignoreSelectors.length})
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMonitorId(mon.id);
                                setActiveTab('diff');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1.5 cursor-pointer"
                            >
                              <GitCompare className="w-3.5 h-3.5" /> View Diff ({mon.snapshots.length})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VISUAL PICKER & NOISE FILTERS ================= */}
        {activeTab === 'picker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Headless Browser DOM Preview */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" /> Interactive Visual Region Picker
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any element on the rendered page below to add its CSS selector to Watch or Ignore lists.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPickerMode('watch')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      pickerMode === 'watch'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Watch Mode (+)
                  </button>
                  <button
                    onClick={() => setPickerMode('ignore')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      pickerMode === 'ignore'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <EyeOff className="w-3.5 h-3.5" /> Ignore Mode (–)
                  </button>
                </div>
              </div>

              {/* Simulated Browser Chrome */}
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="ml-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex-1 truncate">
                  {selectedMonitor.url} (Playwright Headless Viewport 1440×900)
                </span>
              </div>

              {/* Interactive Page Elements */}
              <div className="p-5 space-y-3 bg-slate-950/40 flex-1">
                {VISUAL_DOM_ELEMENTS.map((el) => {
                  const isWatched = selectedMonitor.watchSelectors.includes(el.selector);
                  const isIgnored = selectedMonitor.ignoreSelectors.includes(el.selector);

                  return (
                    <div
                      key={el.id}
                      onClick={() => handleElementClickInPicker(el.selector)}
                      className={`p-4 rounded-xl border-2 transition cursor-pointer relative group ${
                        isWatched
                          ? 'border-emerald-500/70 bg-emerald-950/20'
                          : isIgnored
                          ? 'border-rose-500/70 bg-rose-950/20 opacity-75'
                          : 'border-slate-800 bg-slate-900/60 hover:border-indigo-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                            {el.selector}
                          </code>
                          <span className="text-xs font-semibold text-slate-300">{el.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isWatched && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <Eye className="w-3 h-3" /> WATCHED
                            </span>
                          )}
                          {isIgnored && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                              <EyeOff className="w-3 h-3" /> IGNORED (NOISE)
                            </span>
                          )}
                          {!isWatched && !isIgnored && (
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">
                              Click to {pickerMode === 'watch' ? 'Watch' : 'Ignore'}
                            </span>
                          )}
                        </div>
                      </div>

                      <p
                        className={`text-sm ${
                          isIgnored ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {el.sampleContent}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Saved CSS Selectors & Noise Normalization Engine */}
            <div className="lg:col-span-5 space-y-6">
              {/* Saved CSS Selectors Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" /> Saved CSS Selectors ({selectedMonitor.name})
                </h3>

                {/* Add Custom CSS Selector */}
                <form onSubmit={handleAddCustomSelector} className="flex gap-2">
                  <input
                    type="text"
                    value={customSelectorInput}
                    onChange={(e) => setCustomSelectorInput(e.target.value)}
                    placeholder="Add custom CSS selector e.g. #price-box or .ad-slot"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white cursor-pointer"
                  >
                    + Add to {pickerMode === 'watch' ? 'Watch' : 'Ignore'}
                  </button>
                </form>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Watched Regions (Extracted before hashing)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMonitor.watchSelectors.map((sel) => (
                        <span
                          key={sel}
                          onClick={() => {
                            setPickerMode('watch');
                            handleElementClickInPicker(sel);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:bg-emerald-500/25"
                        >
                          {sel} <span className="text-emerald-400/70">×</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-xs font-semibold text-rose-400 mb-1.5 flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5" /> Ignored Regions (Pruned from DOM before snapshot)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMonitor.ignoreSelectors.map((sel) => (
                        <span
                          key={sel}
                          onClick={() => {
                            setPickerMode('ignore');
                            handleElementClickInPicker(sel);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:bg-rose-500/25"
                        >
                          {sel} <span className="text-rose-400/70">×</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Noise Normalization & Sensitivity Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Filter className="w-4 h-4 text-cyan-400" /> Noise Filtering & Sensitivity Threshold
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Threshold: ≥{selectedMonitor.sensitivity}% Change
                  </span>
                </div>

                {/* Sensitivity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Diff Sensitivity (Minimum character/pixel delta to alert)</span>
                    <span className="text-white font-semibold">{selectedMonitor.sensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={selectedMonitor.sensitivity}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setMonitors((prev) =>
                        prev.map((m) => (m.id === selectedMonitor.id ? { ...m, sensitivity: val } : m))
                      );
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Strict (0.5% - Any typo)</span>
                    <span>Balanced (2% - Paragraph/Price)</span>
                    <span>Major Overhaul (20%)</span>
                  </div>
                </div>

                {/* Normalization Pipeline Toggles */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  {[
                    {
                      key: 'stripTimestamps',
                      label: 'Strip Dynamic Timestamps & Relative Dates',
                      desc: 'Regex normalizes ISO-8601, "2 mins ago", and clock strings before hashing'
                    },
                    {
                      key: 'stripTokens',
                      label: 'Strip Random Session IDs, Nonces & CSRF Tokens',
                      desc: 'Removes hidden inputs, query nonces (?v=9918), and Cloudflare ray IDs'
                    },
                    {
                      key: 'hideAds',
                      label: 'Block Ad Networks & Rotating Promo Carousels',
                      desc: 'Aborts ad network requests in Playwright & strips rotating banner containers'
                    },
                    {
                      key: 'ignoreCounters',
                      label: 'Ignore Live Viewers / API Request Counters',
                      desc: 'Normalizes rapidly incrementing numeric ticker nodes'
                    },
                    {
                      key: 'doubleFetchCalibration',
                      label: 'Auto Double-Fetch Calibration (Anti-Flapping)',
                      desc: 'Fetches page twice 3s apart on creation; auto-ignores nodes that differed between loads'
                    }
                  ].map((item) => {
                    const checked = selectedMonitor.noiseFilters[item.key];
                    return (
                      <label
                        key={item.key}
                        onClick={() => toggleNoiseFilter(item.key)}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="mt-1 accent-indigo-500 w-4 h-4 rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: VERSION TIMELINE & 3-WAY DIFF VIEWER ================= */}
        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Per-Page Version Timeline */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" /> Snapshot Version Timeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Snapshots are stored <span className="text-emerald-400 font-semibold">only</span> when the normalized content SHA-256 hash changes.
                  </p>
                </div>

                {/* Version Selector Dropdowns for Any 2 Versions */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Compare Base (Before)</label>
                    <select
                      value={leftSnapIndex}
                      onChange={(e) => setLeftSnapIndex(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      {selectedMonitor.snapshots.map((s, idx) => (
                        <option key={s.id} value={idx}>
                          {s.version} ({s.timestamp.split(',')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Compare Target (After)</label>
                    <select
                      value={rightSnapIndex}
                      onChange={(e) => setRightSnapIndex(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      {selectedMonitor.snapshots.map((s, idx) => (
                        <option key={s.id} value={idx}>
                          {s.version} ({s.timestamp.split(',')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Timeline List */}
                <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-slate-800">
                  {selectedMonitor.snapshots.map((snap, idx) => {
                    const isRight = idx === rightSnapIndex;
                    const isLeft = idx === leftSnapIndex;
                    return (
                      <div
                        key={snap.id}
                        onClick={() => {
                          if (idx !== rightSnapIndex) setLeftSnapIndex(idx);
                        }}
                        className={`ml-7 p-3.5 rounded-xl border transition cursor-pointer relative ${
                          isRight
                            ? 'bg-indigo-950/40 border-indigo-500/60'
                            : isLeft
                            ? 'bg-amber-950/30 border-amber-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full absolute -left-[22px] top-4 border-2 ${
                            isRight
                              ? 'bg-indigo-400 border-indigo-900'
                              : isLeft
                              ? 'bg-amber-400 border-amber-900'
                              : 'bg-slate-600 border-slate-900'
                          }`}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">{snap.version}</span>
                          <div className="flex items-center gap-1">
                            {isRight && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                                AFTER
                              </span>
                            )}
                            {isLeft && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                BEFORE
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-emerald-400">
                              Δ {snap.changePct}%
                            </span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{snap.timestamp}</div>
                        <div className="text-xs text-slate-200 mt-1.5">{snap.summary}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-1.5 truncate">
                          {snap.hash}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleSimulateCheck(selectedMonitor.id, 'MEANINGFUL_CHANGE')}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Simulate New Change & Snapshot
              </button>
            </div>

            {/* Right Area: 3-Mode Diff Viewer (Text Diff, Highlighted Screenshot Diff, Side-by-Side) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              {/* Diff Mode Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Comparing{' '}
                    <span className="text-amber-300">
                      {selectedMonitor.snapshots[leftSnapIndex]?.version}
                    </span>{' '}
                    →{' '}
                    <span className="text-indigo-400">
                      {selectedMonitor.snapshots[rightSnapIndex]?.version}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Noise regions ({selectedMonitor.ignoreSelectors.join(', ')}) stripped prior to comparison
                  </p>
                </div>

                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setDiffMode('text')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      diffMode === 'text'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Text Diff
                  </button>
                  <button
                    onClick={() => setDiffMode('visual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      diffMode === 'visual'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Highlighted Screenshot Diff
                  </button>
                  <button
                    onClick={() => setDiffMode('side-by-side')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      diffMode === 'side-by-side'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" /> Side-by-Side
                  </button>
                </div>
              </div>

              {/* Mode A: TEXT DIFF */}
              {diffMode === 'text' && (
                <div className="p-5 font-mono text-xs space-y-1.5 bg-slate-950/60 flex-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-slate-800">
                    <span>Normalized DOM Text Extraction Diff</span>
                    <div className="flex items-center gap-3">
                      <span className="text-rose-400">− Removed Line</span>
                      <span className="text-emerald-400">+ Added Line</span>
                    </div>
                  </div>
                  {computedLineDiff.map((row, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg flex items-start gap-3 ${
                        row.type === 'added'
                          ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                          : row.type === 'removed'
                          ? 'bg-rose-500/15 text-rose-200 border border-rose-500/30 line-through opacity-85'
                          : 'bg-slate-900/50 text-slate-300'
                      }`}
                    >
                      <span className="w-6 text-right text-slate-500 select-none">
                        {row.type === 'added' ? '+' : row.type === 'removed' ? '−' : ' '}
                      </span>
                      <span className="flex-1 break-all">{row.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mode B: HIGHLIGHTED SCREENSHOT DIFF */}
              {diffMode === 'visual' && (
                <div className="p-5 space-y-4 bg-slate-950/60 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                        Bounding Box Pixel Diff Overlay
                      </span>
                      <span className="text-slate-400">
                        Ignored selectors dimmed & excluded from pixel comparison
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Highlight Opacity:</span>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={visualOverlayOpacity}
                        onChange={(e) => setVisualOverlayOpacity(Number(e.target.value))}
                        className="w-24 accent-amber-400"
                      />
                    </div>
                  </div>

                  {/* Simulated Full-Page Playwright Screenshot with Pixel Diff Bounding Boxes */}
                  <div className="border-2 border-slate-800 rounded-xl bg-slate-900 p-6 space-y-4 relative overflow-hidden">
                    <div className="text-xs font-mono text-slate-500 flex justify-between">
                      <span>PLAYWRIGHT FULL-PAGE SCREENSHOT RENDER (1440×900)</span>
                      <span>PIXELMISMATCH: 4.8% (BOUNDING BOXES: 2)</span>
                    </div>

                    {/* Unchanged Header Block */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-base font-bold text-white">
                        {selectedMonitor.snapshots[rightSnapIndex]?.blocks.headline}
                      </div>
                    </div>

                    {/* Highlighted Changed Pricing Bounding Box */}
                    <div
                      style={{
                        boxShadow: `0 0 0 3px rgba(245, 158, 11, ${visualOverlayOpacity / 100})`
                      }}
                      className="p-5 rounded-xl bg-amber-500/10 border border-amber-400 relative transition"
                    >
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                        Visual Diff Box #1 ({selectedMonitor.watchSelectors[0] || '#pricing'})
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40">
                          <div className="text-[10px] uppercase text-rose-300 font-semibold">
                            Previous Render ({selectedMonitor.snapshots[leftSnapIndex]?.version})
                          </div>
                          <div className="text-xl font-bold text-rose-200 line-through mt-1">
                            {selectedMonitor.snapshots[leftSnapIndex]?.blocks.priceMain}
                          </div>
                          <div className="text-xs text-rose-300/80">
                            {selectedMonitor.snapshots[leftSnapIndex]?.blocks.tierNote}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40">
                          <div className="text-[10px] uppercase text-emerald-300 font-semibold">
                            New Render ({selectedMonitor.snapshots[rightSnapIndex]?.version})
                          </div>
                          <div className="text-xl font-bold text-emerald-200 mt-1">
                            {selectedMonitor.snapshots[rightSnapIndex]?.blocks.priceMain}
                          </div>
                          <div className="text-xs text-emerald-300/80">
                            {selectedMonitor.snapshots[rightSnapIndex]?.blocks.tierNote}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ignored Mask Regions (Greyed out in Screenshot Diff) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-50">
                      <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-rose-500/40 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-rose-400 font-mono uppercase">
                            [MASKED NOISE: .live-tx-counter]
                          </div>
                          <div className="text-xs text-slate-400 line-through">
                            {selectedMonitor.snapshots[rightSnapIndex]?.blocks.counter}
                          </div>
                        </div>
                        <EyeOff className="w-4 h-4 text-rose-400" />
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-rose-500/40 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-rose-400 font-mono uppercase">
                            [MASKED NOISE: #rotating-customer-banner]
                          </div>
                          <div className="text-xs text-slate-400 line-through">
                            {selectedMonitor.snapshots[rightSnapIndex]?.blocks.banner}
                          </div>
                        </div>
                        <EyeOff className="w-4 h-4 text-rose-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode C: SIDE-BY-SIDE COMPARISON */}
              {diffMode === 'side-by-side' && (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 flex-1">
                  {[
                    {
                      label: 'BEFORE',
                      snap: selectedMonitor.snapshots[leftSnapIndex],
                      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    },
                    {
                      label: 'AFTER',
                      snap: selectedMonitor.snapshots[rightSnapIndex],
                      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }
                  ].map((col, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${col.badgeClass}`}
                          >
                            {col.label}: {col.snap?.version}
                          </span>
                          <span className="text-[11px] text-slate-400">{col.snap?.timestamp}</span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                          <div className="text-xs text-slate-400">Headline</div>
                          <div className="text-sm font-semibold text-white mt-0.5">
                            {col.snap?.blocks.headline}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30">
                          <div className="text-xs text-indigo-300 font-mono">
                            Watched Region ({selectedMonitor.watchSelectors[0]})
                          </div>
                          <div className="text-2xl font-bold text-white mt-1">
                            {col.snap?.blocks.priceMain}
                          </div>
                          <div className="text-xs text-slate-300 mt-1">{col.snap?.blocks.priceSub}</div>
                          <div className="text-xs text-amber-300 mt-2 font-medium">
                            {col.snap?.blocks.tierNote}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-500 space-y-1">
                          <div className="font-mono text-[10px] text-rose-400">
                            Ignored Dynamic Noise (Excluded from Hash):
                          </div>
                          <div>• Counter: {col.snap?.blocks.counter}</div>
                          <div>• Ad Banner: {col.snap?.blocks.banner}</div>
                          <div>• Token: {col.snap?.blocks.token}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 truncate">
                        Normalized Hash: {col.snap?.hash}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SYSTEM ARCHITECTURE & 4 EDGE CASES ================= */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" /> System Design & Edge Case Resolution
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Interactive demonstration of how the architecture solves the 4 core production requirements: Outages/CAPTCHAs, Request Coalescing for 200+ users, High-Entropy pages that differ on every load, and Polite Rate Limiting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QUESTION 1: Is a site outage or CAPTCHA a change? */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Core Requirement #1
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      1. Is a site outage or CAPTCHA treated as a change?
                    </h3>
                  </div>
                  <ShieldAlert className="w-6 h-6 text-purple-400 shrink-0" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">No.</strong> Treating an HTTP 503 error page or a Cloudflare Turnstile CAPTCHA screen as a content change would overwrite the last good snapshot and flood users with false-positive alerts.
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="font-semibold text-slate-200">3-Stage Response Classification Gate:</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>
                      <strong>HTTP 4xx/5xx or Timeout:</strong> Job retries 3× with exponential backoff. If still failing, monitor status becomes <code className="text-rose-300">ERROR</code>. Snapshot is <em>never</em> overwritten.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>
                      <strong>DOM Challenge Fingerprinting:</strong> Scans rendered DOM for known challenge selectors (<code className="text-purple-300">#cf-challenge-running</code>, <code className="text-purple-300">iframe[src*="turnstile"]</code>, <code className="text-purple-300">g-recaptcha</code>). Sets status to <code className="text-purple-300">BLOCKED</code>.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>
                      <strong>HTTP 200 + Valid Watched Selector Present:</strong> Proceeds to noise stripping and SHA-256 hash comparison.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleSimulateCheck(selectedMonitor.id, 'CAPTCHA')}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-medium cursor-pointer"
                  >
                    Test CAPTCHA Gate Now
                  </button>
                  <button
                    onClick={() => handleSimulateCheck(selectedMonitor.id, 'OUTAGE')}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-medium cursor-pointer"
                  >
                    Test HTTP 502 Outage Gate
                  </button>
                </div>
              </div>

              {/* QUESTION 2: If 200 users watch the same URL, is it fetched 200 times? */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Core Requirement #2
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      2. If {simUsersCount} users watch the same URL, is it fetched {simUsersCount} times?
                    </h3>
                  </div>
                  <Users className="w-6 h-6 text-cyan-400 shrink-0" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">No — it is fetched once per tick via Request Coalescing.</strong> We separate <code className="text-cyan-300">TargetURL</code> from <code className="text-cyan-300">UserSubscription</code>. Canonical URLs are normalized (strip UTM params, sort query keys) and scheduled at the shortest active subscriber interval.
                </p>

                {/* Interactive Coalescing Calculator */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Simulate Subscribers Watching Same URL:</span>
                    <span className="font-bold text-cyan-400">{simUsersCount} Users</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={simUsersCount}
                    onChange={(e) => setSimUsersCount(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Naive Fetches/Day</div>
                      <div className="text-sm font-bold text-rose-400">
                        {(simUsersCount * 96).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Coalesced Fetches/Day</div>
                      <div className="text-sm font-bold text-emerald-400">96 (1 per 15m)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Playwright CPU Saved</div>
                      <div className="text-sm font-bold text-cyan-300">
                        {(100 - (1 / simUsersCount) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    *1 Headless DOM render per tick → Evaluates each subscriber's custom CSS selector slice in-memory → Fans out notifications.
                  </div>
                </div>
              </div>

              {/* QUESTION 3: How to avoid endless alerts on pages that differ on every load? */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Core Requirement #3
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      3. Avoiding endless alerts on high-entropy pages
                    </h3>
                  </div>
                  <Filter className="w-6 h-6 text-emerald-400 shrink-0" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Pages with timestamps, CSRF tokens, or rotating ads produce a different raw HTML string on every load. We combine <strong>Double-Fetch Calibration</strong> (fetching twice 3s apart on creation to auto-mask mutating DOM nodes) with a <strong>Pre-Hash Normalization Pipeline</strong>.
                </p>

                {/* Live Interactive Normalizer Sandbox */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400">
                    Try editing the Raw HTML below (Notice timestamps/tokens don't change the Normalized Output):
                  </div>
                  <textarea
                    rows={3}
                    value={rawHtmlInput}
                    onChange={(e) => setRawHtmlInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[11px] font-mono text-amber-200 focus:outline-none"
                  />
                  <div className="text-[11px] font-semibold text-emerald-400">
                    Normalized Output (Fed into SHA-256 Content Hasher):
                  </div>
                  <pre className="p-2 rounded-lg bg-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    {normalizedHtmlOutput}
                  </pre>
                </div>
              </div>

              {/* QUESTION 4: How to avoid hammering a site with requests? */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Core Requirement #4
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      4. How to avoid hammering a target site with requests?
                    </h3>
                  </div>
                  <Clock className="w-6 h-6 text-amber-400 shrink-0" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Even if users add 500 distinct product URLs on the same domain, our job scheduler enforces strict per-domain politeness policies:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-amber-300 mb-1">1. Per-Domain Token Bucket</div>
                    <p className="text-slate-400 text-[11px]">
                      Redis-backed rate limiter caps concurrency to 1 active headless browser per hostname and max 2 requests/min per domain with random jitter.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-indigo-300 mb-1">2. Conditional HTTP Pre-Check</div>
                    <p className="text-slate-400 text-[11px]">
                      Sends lightweight <code className="text-indigo-200">If-None-Match (ETag)</code> / <code className="text-indigo-200">If-Modified-Since</code> first; skips heavy Playwright launch on HTTP 304.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-emerald-300 mb-1">3. Exponential Backoff + 429</div>
                    <p className="text-slate-400 text-[11px]">
                      Honors <code className="text-emerald-200">Retry-After</code> headers on HTTP 429/503 and backs off (2s → 8s → 32s → circuit breaker pause).
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-bold text-cyan-300 mb-1">4. Minimum Floor (15m) & Coalescing</div>
                    <p className="text-slate-400 text-[11px]">
                      Enforces a 15-minute minimum interval floor and merges identical URLs across all users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: JOB QUEUE & WEBHOOK ALERTS ================= */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Scheduler & Headless Worker Job Queue */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" /> Scheduler & Playwright Worker Queue
                  </h2>
                  <p className="text-xs text-slate-400">
                    Public pages only • 15s navigation timeout • Max 3 retries with jittered backoff
                  </p>
                </div>
                <button
                  onClick={() => handleSimulateCheck(selectedMonitor.id, 'MEANINGFUL_CHANGE')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white cursor-pointer"
                >
                  + Dispatch Check Job
                </button>
              </div>

              <div className="divide-y divide-slate-800">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 hover:bg-slate-800/30 transition space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-indigo-400 font-bold">{job.id}</span>
                        <span className="text-sm font-semibold text-white">{job.monitorName}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          1 Fetch → {job.coalescedUsers} Watchers
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{job.timestamp}</span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 font-mono">
                      {job.hashResult}
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span>Attempts: {job.attempt}</span>
                      <span>Playwright Duration: {job.duration}</span>
                      <span>Credentials: None (Stateless Context)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Alert Payloads (Telegram/Discord Webhook & Email / Daily Digest) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Telegram / Discord Webhook Payload
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Idempotent Dedup Key
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Alerts include an idempotency key <code className="text-indigo-300">dedup_key = sha256(monitor_id + new_content_hash)</code> so retries never send duplicate notifications.
                </p>

                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-200 overflow-x-auto leading-relaxed">
{JSON.stringify(
  {
    event: 'website.change_detected',
    dedup_key: `${selectedMonitor.id}_${selectedMonitor.snapshots[0]?.hash.slice(7, 19)}`,
    monitor: {
      name: selectedMonitor.name,
      url: selectedMonitor.url,
      interval: selectedMonitor.interval
    },
    diff: {
      previous_version: selectedMonitor.snapshots[1]?.version || 'v1',
      current_version: selectedMonitor.snapshots[0]?.version,
      change_percentage: `${selectedMonitor.snapshots[0]?.changePct}%`,
      summary: selectedMonitor.snapshots[0]?.summary,
      watched_selectors: selectedMonitor.watchSelectors,
      diff_viewer_url: `https://diffpulse.app/monitors/${selectedMonitor.id}/diff`
    }
  },
  null,
  2
)}
                </pre>
              </div>

              {/* Email & Optional Daily Digest Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" /> Email Alert & Optional Daily Digest
                  </h3>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMonitor.channels.dailyDigest}
                      onChange={() =>
                        setMonitors((prev) =>
                          prev.map((m) =>
                            m.id === selectedMonitor.id
                              ? {
                                  ...m,
                                  channels: { ...m.channels, dailyDigest: !m.channels.dailyDigest }
                                }
                              : m
                          )
                        )
                      }
                      className="accent-indigo-500 rounded"
                    />
                    Batch into Daily Digest
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400 border-b border-slate-800 pb-2">
                    <div>
                      <strong>Subject:</strong> [DiffPulse] Change detected on {selectedMonitor.name} (Δ{' '}
                      {selectedMonitor.snapshots[0]?.changePct}%)
                    </div>
                  </div>
                  <div className="text-slate-200 space-y-1.5 pt-1">
                    <p>{selectedMonitor.snapshots[0]?.summary}</p>
                    <div className="p-2 rounded bg-rose-500/10 text-rose-300 font-mono text-[11px]">
                      − {selectedMonitor.snapshots[1]?.blocks.priceMain || 'Previous Value'}
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[11px]">
                      + {selectedMonitor.snapshots[0]?.blocks.priceMain}
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('diff')}
                      className="text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      Open Visual & Side-by-Side Diff Viewer <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD NEW MONITOR MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Add Public Website Monitor</h3>
                <p className="text-xs text-slate-400">
                  Tip: Try entering <code className="text-indigo-300">https://stripe.com/pricing</code> to test automatic URL coalescing!
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMonitor} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Public Webpage URL</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/pricing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Monitor Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Competitor Enterprise Pricing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Check Interval (15m – 24h)
                  </label>
                  <select
                    value={newInterval}
                    onChange={(e) => setNewInterval(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="15 min">Every 15 mins</option>
                    <option value="30 min">Every 30 mins</option>
                    <option value="1 hour">Every 1 hour</option>
                    <option value="6 hours">Every 6 hours</option>
                    <option value="12 hours">Every 12 hours</option>
                    <option value="24 hours">Every 24 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Sensitivity Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={newSensitivity}
                    onChange={(e) => setNewSensitivity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newDigest}
                  onChange={(e) => setNewDigest(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4 rounded"
                />
                <div>
                  <div className="font-semibold text-slate-200">Enable Optional Daily Digest</div>
                  <div className="text-[11px] text-slate-400">
                    Batch non-urgent changes into a single summary email + webhook once per day
                  </div>
                </div>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  Calibrate & Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBadge({ status }) {
  if (status === 'BLOCKED') return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
  if (status === 'ERROR') return <AlertTriangle className="w-3.5 h-3.5 shrink-0" />;
  return <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
}