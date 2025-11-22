
import { ReportData, WeeklyReport, AdCreative } from "../types";

// --- SIMULATED DATABASE ---
const STORAGE_KEY = 'nexus_weekly_report_v1';

const DEFAULT_REPORT: WeeklyReport = {
  wins: [
    "TikTok creative #3 outperforming all other assets by 40%.",
    "CPL dropped by 22% after landing page speed optimization.",
    "New 'Interest' targeting stack showing high intent signals."
  ],
  problems: [
    "One creative fatigued early (CTR dropped below 0.5%).",
    "Weekend spend dipped slightly due to high auction prices."
  ],
  actions: [
    "Replaced dead creative with V2 variation (UGC style).",
    "Shifted 25% of budget to TikTok campaigns.",
    "Fixed flagged ad copy to comply with new policy."
  ],
  nextSteps: [
    "Launch new creative batch (UGC style) on Thursday.",
    "Increase budget by 15% if CPL holds under $25.",
    "Test 'Urgency' headline variant on Retargeting campaigns."
  ],
  lastUpdated: new Date().toISOString()
};

// Helper to generate the graph data
const generateDailyData = (days: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Random but realistic variation
    const baseSpend = 400 + Math.random() * 200;
    const cpl = 20 + Math.random() * 15; // $20 - $35 CPL
    const conversions = Math.floor(baseSpend / cpl);
    const clicks = conversions * (15 + Math.random() * 10); // ~5% - 10% CVR implication
    const impressions = clicks * (50 + Math.random() * 20); // ~1.5% - 2% CTR implication

    let notes = undefined;
    if (Math.random() > 0.85) notes = "Optimized bid strategy";
    if (Math.random() > 0.9) notes = "Launched new creative set";

    data.push({
      date: dateStr,
      spend: Math.floor(baseSpend),
      conversions,
      clicks,
      impressions,
      cpl,
      ctr: (clicks / impressions) * 100,
      notes
    });
  }
  return data;
};

const MOCK_ADS: AdCreative[] = [
  { id: '1', headline: "Get 50% Off Your First Month", platform: "Facebook", type: "Image", status: "Active", leads: 142, ctr: 2.4, comments: 12, thumbnailUrl: "https://picsum.photos/seed/ad1/600/338" },
  { id: '2', headline: "Why 10,000+ Users Choose Nexus", platform: "TikTok", type: "Video", status: "Testing", leads: 48, ctr: 1.1, comments: 8, thumbnailUrl: "https://picsum.photos/seed/ad2/600/338" },
  { id: '3', headline: "Stop Wasting Money on Ads", platform: "Google", type: "Image", status: "Paused", leads: 12, ctr: 0.6, comments: 3, thumbnailUrl: "https://picsum.photos/seed/ad3/600/338" }
];

/**
 * FETCH REPORT DATA
 * Simulates a backend call that aggregates Ad Platform APIs + Local Database
 */
export const getReportData = async (clientId: string, days: number = 30): Promise<ReportData> => {
  // Simulate Network Latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // 1. Fetch Weekly Report (Simulating DB read)
  const storedReport = localStorage.getItem(`${STORAGE_KEY}_${clientId}`);
  const weeklyReport = storedReport ? JSON.parse(storedReport) : DEFAULT_REPORT;

  // 2. Generate Performance Data (Simulating Aggregation Service)
  const dailyData = generateDailyData(days);
  
  // Calculate Totals
  const totalSpend = dailyData.reduce((acc, curr) => acc + curr.spend, 0);
  const totalConversions = dailyData.reduce((acc, curr) => acc + curr.conversions, 0);
  const totalClicks = dailyData.reduce((acc, curr) => acc + curr.clicks, 0);
  const totalImpressions = dailyData.reduce((acc, curr) => acc + curr.impressions, 0);

  return {
    totals: {
      spend: totalSpend,
      leads: totalConversions,
      cpl: totalConversions > 0 ? totalSpend / totalConversions : 0,
      ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    },
    dailyData,
    weeklyReport,
    ads: MOCK_ADS
  };
};

/**
 * UPDATE WEEKLY REPORT (ADMIN ONLY)
 * Saves the strategist's notes to the "Database"
 */
export const updateWeeklyReport = async (clientId: string, report: WeeklyReport): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay
  const updatedReport = { ...report, lastUpdated: new Date().toISOString() };
  localStorage.setItem(`${STORAGE_KEY}_${clientId}`, JSON.stringify(updatedReport));
  return true;
};

/**
 * TRIGGER MANUAL SYNC
 * Forces a refresh from Ad Platforms
 */
export const triggerDataSync = async (clientId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API sync time
  return true;
};

/**
 * GENERATE PDF
 * Returns a simulated download URL
 */
export const generatePDF = async (reportData: ReportData): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "#"; // In a real app, this would be a blob URL
};
