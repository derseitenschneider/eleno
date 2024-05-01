import Skeleton from "@/components/ui/skeleton";
import "@/pages/dashboard/dashboard.style.scss";

export default function DashboardSkeleton() {
	return (
		<div className="dashboard skeleton">
			{/* Header */}
			<div style={{ gridArea: "header" }}>
				<Skeleton className="h-[37.5px] w-[220px] mb-[30px]" />
				<Skeleton className="h-[18px] w-[300px] space-y-[20px]" />
			</div>

			{/* Quick-Links */}
			<div style={{ gridArea: "quick-links" }}>
				<Skeleton className="h-[30px] w-[125px] mb-[31.5px]" />
				<div className="flex gap-[32px]">
					<Skeleton className="h-[18px] w-[157px] space-y-[20px]" />
					<Skeleton className="h-[18px] w-[150px] space-y-[20px]" />
					<Skeleton className="h-[18px] w-[150px] space-y-[20px]" />
					<Skeleton className="h-[18px] w-[150px] space-y-[20px]" />
				</div>
			</div>

			{/* Overview */}
			<div style={{ gridArea: "overview" }}>
				<Skeleton className="h-[30px] w-[125px] mb-[24px]" />
				<div className="flex gap-20">
					<Skeleton className="h-[160px] w-[100%]" />
					<Skeleton className="h-[160px] w-[100%]" />
				</div>
			</div>

			{/* News */}
			<div style={{ gridArea: "aside", overflow: "hidden" }}>
				<Skeleton className="h-[30px] w-[80px] mb-[31.5px]" />

				<Skeleton className="h-[16px] w-[80px] mb-[8px]" />
				<Skeleton className="h-[24px] w-[100%] mb-[12px]" />
				<Skeleton className="h-[200px] w-[100%] mb-[31.5px]" />

				<Skeleton className="h-[16px] w-[80px] mb-[8px]" />
				<Skeleton className="h-[24px] w-[100%] mb-[12px]" />
				<Skeleton className="h-[200px] w-[100%] mb-[31.5px]" />
			</div>

			{/* Footer */}
			<div
				className="footer-dashboard"
				style={{ gridArea: "footer", padding: "14px" }}
			>
				<Skeleton className="h-[12px] w-[80px]" />
			</div>
		</div>
	);
}
