import Skeleton from "@/components/ui/skeleton";

export default function StudentsSkeleton() {
	return (
		<div style={{ padding: "2rem 3.2rem" }}>
			{/* Header */}
			<div>
				<Skeleton className="h-[37.5px] w-[220px] mb-[35px]" />
				<Skeleton className="h-[28px] w-[280px] mb-[20px]" />
				<Skeleton className="h-[22px] w-[200px] mb-[20px]" />
				<div className="flex justify-between gap-12">
					<Skeleton className="h-[30px] w-[100px] mb-[31.5px] mr-[auto]" />
					<Skeleton className="h-[30px] w-[100px] mb-[31.5px]" />
					<Skeleton className="h-[30px] w-[160px] mb-[31.5px]" />
					<Skeleton className="h-[30px] w-[100px] mb-[31.5px]" />
				</div>
			</div>

			{/* Table */}
			<div>
				<div className="flex flex-col gap-2 h-[100%]">
					<Skeleton className="h-[37px] w-[100%] space-y-[20px]" />
					<Skeleton className="h-[400px] w-[100%] space-y-[20px]" />
				</div>
			</div>
		</div>
	);
}
