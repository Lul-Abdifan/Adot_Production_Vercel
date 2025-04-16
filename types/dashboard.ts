type CountStatistics = {
  usersCount: number;
  totalInsightCount: number;
  archivedInsightCount: number;
  totalTopicCount: number;
  archivedTopicCount: number;
  totalCategoryCount: number;
  archivedCategoryCount: number;
};

type StatsItem = {
  _id: string;
  count: number;
};

type ActiveUsersData = {
  activeUsersStats: StatsItem[];
  totalActiveUsersAdded: number;
  percentageGrowth: number;
};

type RegisteredUsersData = {
  registeredUsersStats: StatsItem[];
  totalRegisteredUsersAdded: number;
  percentageGrowth: number;
};

type InsightsAddedStats = {
  insightsAddedStats: StatsItem[];
  totalInsightsAdded: number;
  percentageGrowth: number;
};

type TopicsAddedStats = {
  topicsAddedStats: StatsItem[];
  totalTopicsAdded: number;
  percentageGrowth: number;
};

type CategoriesAddedStats = {
  categoriesAddedStats: StatsItem[];
  totalCategoriesAdded: number;
  percentageGrowth: number;
};

type Feature = {
  featureName: string;
  numberOfUniqueUsers: number;
  popularity: number;
};
