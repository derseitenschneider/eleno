import Skeleton from "@/components/ui/skeleton";
import "@/pages/lessons/lessons.style.scss";
import "@/components/features/lessons/lessonHeader/lessonHeader.style.scss";

export default function LessonSkeleton() {
	return (
		<div>
			{/* Header */}
			<div
				className="container container--header"
				style={{ padding: "20px 16px 20px 32px" }}
			>
				<div className="wrapper-center">
					<div className="container-infos">
						<div className="row-1">
							<Skeleton className="h-[26px] w-[26px] rounded-full" />
							<Skeleton className="h-[26px] w-[150px]" />
						</div>
						<div>
							<Skeleton className="h-[20px] w-[250px]" />
						</div>
					</div>
					<Skeleton className="h-[34px] w-[110px]" />
				</div>
			</div>
		</div>
	);
}
