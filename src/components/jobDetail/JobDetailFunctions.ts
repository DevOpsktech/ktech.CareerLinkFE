// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatSalary = (job: any) => {
  const salary = job.salary;
  const min = salary?.min ?? job.salaryMin;
  const max = salary?.max ?? job.salaryMax;
  const currency = salary?.currency ?? job.salaryCurrency ?? "USD";
  const periodRaw = salary?.period ?? job.salaryPeriod;
  if (min == null && max == null) return "Salary not specified";

  const period =
    periodRaw === "hour"
      ? "hourly"
      : periodRaw === "year"
      ? "yearly"
      : periodRaw;

  const formatAmount = (amount: number) => {
    const symbol = currencySymbol(currency);
    if (period === "hourly") return `${symbol}${amount}`;
    return `${symbol}${amount.toLocaleString()}`;
  };

  if (min != null && max != null) {
    return `${formatAmount(min)} - ${formatAmount(max)}${
      period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
    }`;
  } else if (min != null) {
    return `From ${formatAmount(min)}${
      period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
    }`;
  }
  return "Competitive salary";
};

const currencySymbol = (code: string) => {
  switch (code) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return "$";
  }
};

export const formatJobType = (type: string) => {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatPostedDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

export const formatDeadline = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
