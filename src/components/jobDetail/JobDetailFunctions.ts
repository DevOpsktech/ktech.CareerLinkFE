// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatSalary = (job: any) => {
  if (!job.salary) return "Salary not specified";

  const { min, max, period } = job.salary;
  const formatAmount = (amount: number) => {
    if (period === "hourly") return `$${amount}`;
    return `$${amount.toLocaleString()}`;
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}${
      period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
    }`;
  } else if (min) {
    return `From ${formatAmount(min)}${
      period === "hourly" ? "/hour" : period === "yearly" ? "/year" : "/month"
    }`;
  }
  return "Competitive salary";
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
