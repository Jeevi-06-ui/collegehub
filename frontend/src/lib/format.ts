export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const formatPackage = (value: number) => `${value.toFixed(1)} LPA`;

export const formatLocation = (location: { city: string; state: string }) => `${location.city}, ${location.state}`;
