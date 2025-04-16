import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextApiRequest, NextApiResponse } from "next";

// Load constants from your constants file or environment
import { dimensions, metrics } from "@/constants/constants";
import { error } from "console";

// Initialize the Google Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient();

type RunReportInput = {
  dimensions?: { name: string }[];
  metrics?: { name: string }[];
  startDate?: string;
  endDate?: string;
};

// Helper function to generate default start date (7 days ago)
const getDefaultStartDate = () => {
  const date = new Date();
  const start = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  const day = start.getDate();
  const month = start.getMonth() + 1;
  const year = start.getFullYear();
  return `${year}-${month}-${day}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const {
      dimensions,
      metrics,
      startDate = getDefaultStartDate(),
      endDate = "today",
    }: RunReportInput = req.body;

    // Validate dimensions and metrics
    if (!dimensions || dimensions.length === 0) {
      res.status(400).json({ error: "Please provide dimensions" });
      return;
    }

    if (!metrics || metrics.length === 0) {
      res.status(400).json({ error: "Please provide metrics" });
      return;
    }

    // Build the request object for the GA4 API
    const requestPayload = {
      property: `properties/${process.env.NEXT_PUBLIC_GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: dimensions.map((dimension) => ({
        name: dimension.name,
      })),
      metrics: metrics.map((metric) => ({
        name: metric.name,
      })),
    };

    // Make the API call
    const [response] = await analyticsDataClient.runReport(requestPayload);

    // Process the response
    const resData = response.rows?.map((row) => {
      const curRow: any = {};

      row.dimensionValues?.forEach((dim, index) => {
        curRow[dimensions[index].name] = dim.value || "(not set)";
      });

      row.metricValues?.forEach((met, index) => {
        curRow[metrics[index].name] = met.value || "0";
      });

      return curRow;
    });

    // Return the processed data
    res.status(200).json({ data: resData });
  } catch (error) {
    // Handle any errors
    res.status(500).json({error: error});
  }
}
