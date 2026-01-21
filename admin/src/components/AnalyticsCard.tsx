export default function AnalyticsCard({
  title,
  stats,
}: {
  title: string;
  stats: string;
}) {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm">{stats}</p>
    </div>
  );
}