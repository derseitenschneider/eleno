<?php

namespace App\Services\Scheduler;

use InvalidArgumentException; // It's good practice to import exceptions

class TimeSlot {
	public $day;
	public $startTime; // in minutes
	public $endTime;   // in minutes
	public $duration;  // in minutes
	public $dayIndex;  // 1 for Monday, 7 for Sunday

	private static $dayMap = [
		'Monday'    => 1,
		'Tuesday'   => 2,
		'Wednesday' => 3,
		'Thursday'  => 4,
		'Friday'    => 5,
		'Saturday'  => 6,
		'Sunday'    => 7,
	];

	public function __construct( string $day, int $startTime, int $endTime ) {
		if ( ! isset( self::$dayMap[ $day ] ) ) {
			throw new InvalidArgumentException( 'Invalid day provided: ' . $day );
		}
		if ( $startTime >= $endTime ) {
			throw new InvalidArgumentException( "Start time ({$startTime}) must be before end time ({$endTime}) for day {$day}." );
		}

		$this->day       = $day;
		$this->startTime = $startTime;
		$this->endTime   = $endTime;
		$this->duration  = $endTime - $startTime;
		$this->dayIndex  = self::$dayMap[ $day ];
	}

	public function overlaps( TimeSlot $other ): bool {
		return $this->dayIndex === $other->dayIndex &&
				$this->startTime < $other->endTime &&
				$this->endTime > $other->startTime;
	}

	public function getOverlap( TimeSlot $other ): ?TimeSlot {
		if ( ! $this->overlaps( $other ) ) {
			return null;
		}

		// This constructor will throw an exception if start >= end, which shouldn't happen here
		// if overlaps() is true, but it's an implicit check.
		return new TimeSlot(
			$this->day, // Day will be the same due to overlap check
			max( $this->startTime, $other->startTime ),
			min( $this->endTime, $other->endTime )
		);
	}

	public function isAdjacentTo( TimeSlot $other ): bool {
		return $this->dayIndex === $other->dayIndex &&
				( $this->endTime === $other->startTime || $this->startTime === $other->endTime );
	}

	public function getGapDuration( TimeSlot $other ): int {
		if ( $this->dayIndex !== $other->dayIndex ) {
			return -1; // Indicates different days, not a gap in the same day
		}

		if ( $this->endTime <= $other->startTime ) {
			return $other->startTime - $this->endTime; // Gap after this slot, before other
		} elseif ( $this->startTime >= $other->endTime ) {
			return $this->startTime - $other->endTime; // Gap after other slot, before this
		}

		return 0; // Indicates overlap or adjacency with no gap
	}

	public function __toString(): string {
		// Useful for debugging
		return "{$this->day}[" . DurationAwareScheduler::formatMinutesToTime( $this->startTime ) . '-' . DurationAwareScheduler::formatMinutesToTime( $this->endTime ) . " ({$this->duration}m)]";
	}
}

class Person {
	public $id;
	public $name;
	protected $availableSlots = []; // Array of TimeSlot objects

	public function __construct( $id, string $name ) {
		$this->id   = $id;
		$this->name = $name;
	}

	public function addAvailability( string $day, int $startTime, int $endTime ): void {
		try {
			$this->availableSlots[] = new TimeSlot( $day, $startTime, $endTime );
		} catch ( InvalidArgumentException $e ) {
			// Optionally log this error or handle it, e.g., by skipping invalid availability
			error_log( "Error adding availability for {$this->name}: " . $e->getMessage() );
		}
	}

	public function getAvailableSlots(): array {
		return $this->availableSlots;
	}

	public function setAvailabilityFromArray( array $availabilityData ): void {
		$this->availableSlots = [];

		if ( ! isset( $availabilityData['days'] ) || ! is_array( $availabilityData['days'] ) ) {
			error_log( "Warning: Missing or invalid 'days' array in availability data for {$this->name}." );
			return;
		}
		if ( ! isset( $availabilityData['times'] ) || ! is_array( $availabilityData['times'] ) ) {
			error_log( "Warning: Missing or invalid 'times' array in availability data for {$this->name}." );
			return;
		}

		foreach ( $availabilityData['days'] as $day ) {
			if ( ! isset( $availabilityData['times'][ $day ] ) || ! is_array( $availabilityData['times'][ $day ] ) ) {
				error_log( "Warning: Missing or invalid time slots for day '{$day}' for {$this->name}." );
				continue;
			}
			foreach ( $availabilityData['times'][ $day ] as $timeSlotArray ) {
				if ( isset( $timeSlotArray['start'], $timeSlotArray['end'] ) ) {
					$this->addAvailability( $day, (int) $timeSlotArray['start'], (int) $timeSlotArray['end'] );
				} else {
					error_log( "Warning: Invalid time slot structure for day '{$day}' for {$this->name}. Missing start/end." );
				}
			}
		}
	}
}

class Teacher extends Person {
	public $schedule = []; // studentId => TimeSlot object

	public function getSchedule(): array {
		return $this->schedule;
	}

	public function addToSchedule( string $studentId, TimeSlot $slot ): void {
		$this->schedule[ $studentId ] = $slot;
	}

	public function getScheduledSlots(): array {
		return array_values( $this->schedule );
	}

	public function getFormattedSchedule(): array {
		$formattedSchedule = [];

		foreach ( $this->schedule as $studentId => $slot ) {
			// $slot is guaranteed to be a TimeSlot object by addToSchedule
			$formattedSchedule[] = [
				'studentId' => $studentId,
				'day'       => $slot->day,
				'startTime' => $slot->startTime, // in minutes
				'endTime'   => $slot->endTime,   // in minutes
				'duration'  => $slot->duration,  // in minutes
			];
		}

		// Sort by day index then start time
		usort(
			$formattedSchedule,
			function ( $a, $b ) {
				$dayIndexA = TimeSlot::$dayMap[ $a['day'] ] ?? 0; // Access dayMap statically or pass it around
				$dayIndexB = TimeSlot::$dayMap[ $b['day'] ] ?? 0; // Or better, store dayIndex in formatted schedule too

				if ( $dayIndexA === $dayIndexB ) {
					return $a['startTime'] <=> $b['startTime'];
				}
				return $dayIndexA <=> $dayIndexB;
			}
		);
		return $formattedSchedule;
	}
}

class Student extends Person {
	private $assignedSlot = null; // TimeSlot object or null
	private $lessonDuration; // in minutes

	public function __construct( $id, string $name, int $lessonDuration = 30 ) {
		parent::__construct( $id, $name );
		if ( $lessonDuration <= 0 ) {
			throw new InvalidArgumentException( "Lesson duration must be positive for student {$name}." );
		}
		$this->lessonDuration = $lessonDuration;
	}

	public function getLessonDuration(): int {
		return $this->lessonDuration;
	}

	public function getAssignedSlot(): ?TimeSlot {
		return $this->assignedSlot;
	}

	public function setAssignedSlot( ?TimeSlot $slot ): void {
		// Allow null to unassign
		$this->assignedSlot = $slot;
	}
}

class DurationAwareScheduler {
	private $teacher;
	private $students           = []; // id => Student object
	private $assignedSlotsByDay = []; // dayIndex => array of TimeSlot objects
	private $maxExecutionTime   = 30; // in seconds
	private $startTime;
	private $plannedReshuffles = []; // studentId => TimeSlot (for current reshuffle attempt)

	// Public static helper for formatting, could also be in TimeSlot or a utility class
	public static function formatMinutesToTime( int $minutes ): string {
		$hours = floor( $minutes / 60 );
		$mins  = $minutes % 60;
		return sprintf( '%02d:%02d', $hours, $mins );
	}


	public function __construct( Teacher $teacher ) {
		$this->teacher   = $teacher;
		$this->startTime = microtime( true );

		// Initialize assignedSlotsByDay for valid day indices (1-7)
		for ( $i = 1; $i <= 7; $i++ ) {
			$this->assignedSlotsByDay[ $i ] = [];
		}
	}

	public function addStudent( Student $student ): void {
		$this->students[ $student->id ] = $student;
	}

	public function calculateOptimalSchedule(): array {
		echo 'Starting duration-aware optimization with reshuffling for ' . count( $this->students ) . " students...\n";

		$allPossibleSlots = $this->precalculateAllLessonSlots();
		$sortedStudentIds = $this->sortStudentsByConstraint( $allPossibleSlots );

		$assignedCount = 0;
		foreach ( $sortedStudentIds as $studentId ) {
			if ( microtime( true ) - $this->startTime > $this->maxExecutionTime ) {
				echo 'Timeout reached after ' . ( microtime( true ) - $this->startTime ) . "s, stopping with {$assignedCount} assignments\n";
				break;
			}

			if ( ! isset( $this->students[ $studentId ] ) ) {
				echo "Warning: Student ID {$studentId} from sort list not found in students property. Skipping.\n";
				continue;
			}
			$student        = $this->students[ $studentId ];
			$availableSlots = $allPossibleSlots[ $studentId ] ?? [];

			if ( empty( $availableSlots ) ) {
				echo "No pre-calculated available slots for student: {$student->name} (ID: {$studentId}, duration: {$student->getLessonDuration()} min)\n";
				continue;
			}

			$bestSlot = $this->findBestSlotWithoutOverlap( $availableSlots ); // lessonDuration is in student object
			if ( $bestSlot ) {
				$this->assignSlot( $studentId, $bestSlot );
				++$assignedCount;
				echo "Assigned student: {$student->name} (ID: {$studentId}, {$student->getLessonDuration()} min) to {$bestSlot} - {$assignedCount} total\n";
			} else {
				echo "Normal assignment failed for {$student->name} (ID: {$studentId}), attempting reshuffle...\n";
				if ( $this->tryReshuffleToFit( $student, $availableSlots, $allPossibleSlots ) ) { // Pass student object
					++$assignedCount;
					// assignSlot is called within tryReshuffleToFit or its sub-methods if successful
					echo "-> Successfully reshuffled and assigned: {$student->name} (ID: {$studentId}, {$student->getLessonDuration()} min) - {$assignedCount} total\n";
				} else {
					echo "-> Could not fit student even with reshuffling: {$student->name} (ID: {$studentId}, duration: {$student->getLessonDuration()} min)\n";
				}
			}
		}

		echo "Optimization completed with {$assignedCount} assignments\n";
		return $this->teacher->getFormattedSchedule();
	}

	private function precalculateAllLessonSlots(): array {
		$teacherSlots     = $this->teacher->getAvailableSlots();
		$allPossibleSlots = [];

		foreach ( $this->students as $studentId => $student ) {
			$studentOwnSlots         = $student->getAvailableSlots();
			$possibleSlotsForStudent = [];
			$lessonDuration          = $student->getLessonDuration();

			foreach ( $teacherSlots as $teacherSlot ) {
				foreach ( $studentOwnSlots as $studentSlot ) {
					$overlap = $teacherSlot->getOverlap( $studentSlot );
					if ( $overlap !== null && $overlap->duration >= $lessonDuration ) {
						$maxStartTime = $overlap->endTime - $lessonDuration;
						for ( $startTime = $overlap->startTime; $startTime <= $maxStartTime; $startTime += 15 ) { // 15 min step
							try {
								$lessonSlot                = new TimeSlot( $overlap->day, $startTime, $startTime + $lessonDuration );
								$possibleSlotsForStudent[] = $lessonSlot;
							} catch ( InvalidArgumentException $e ) {
								// error_log("Skipping invalid pre-calculated slot: " . $e->getMessage());
								// This can happen if $startTime + $lessonDuration somehow creates an invalid slot, though unlikely here
							}
						}
					}
				}
			}
			$allPossibleSlots[ $studentId ] = $possibleSlotsForStudent;
		}
		return $allPossibleSlots;
	}

	private function sortStudentsByConstraint( array $allPossibleSlots ): array {
		$studentIds = array_keys( $this->students );
		usort(
			$studentIds,
			function ( string $aId, string $bId ) use ( $allPossibleSlots ): int {
				$countA = count( $allPossibleSlots[ $aId ] ?? [] );
				$countB = count( $allPossibleSlots[ $bId ] ?? [] );
				return $countA <=> $countB;
			}
		);
		return $studentIds;
	}

	// Removed $lessonDuration param, get it from student object if needed, or assume slots passed are already correct duration
	private function findBestSlotWithoutOverlap( array $candidateLessonSlots ): ?TimeSlot {
		$currentTeacherSchedule = $this->teacher->getScheduledSlots(); // These are TimeSlot objects

		if ( empty( $currentTeacherSchedule ) ) {
			return $candidateLessonSlots[0] ?? null; // Return first if no schedule yet, if any slot exists
		}

		$validNonOverlappingSlots = [];
		foreach ( $candidateLessonSlots as $slot ) {
			if ( $this->isSlotValidWithoutOverlap( $slot, $currentTeacherSchedule ) ) {
				$validNonOverlappingSlots[] = $slot;
			}
		}
		if ( empty( $validNonOverlappingSlots ) ) {
			return null;
		}

		// Prioritize adjacent slots
		foreach ( $validNonOverlappingSlots as $slot ) {
			// DayIndex is guaranteed by TimeSlot constructor to be 1-7
			$daySlots = $this->assignedSlotsByDay[ $slot->dayIndex ]; // This is safe now
			foreach ( $daySlots as $assignedSlot ) {
				if ( $slot->isAdjacentTo( $assignedSlot ) ) {
					return $slot; // Found an adjacent slot
				}
			}
		}

		// If no adjacent, find slot with minimum gap to existing lessons on that day
		// Or if day is empty, just take the first valid one
		$bestSlotOverall = null;
		$minOverallGap   = PHP_INT_MAX;

		foreach ( $validNonOverlappingSlots as $slot ) {
			$daySlots = $this->assignedSlotsByDay[ $slot->dayIndex ];
			if ( empty( $daySlots ) ) { // If day is empty, this is a good candidate (first slot for the day)
				if ( $bestSlotOverall === null ) {
					$bestSlotOverall = $slot; // Take first available if all days are empty
				}
				// Potentially continue to see if other empty days have earlier slots? Or just return $slot here?
				// For now, let's prefer any slot on an empty day. If multiple, first one encountered.
				// To be more deterministic, one might sort $validNonOverlappingSlots by day then time first.
				return $slot;
			}

			$minGapThisSlot          = PHP_INT_MAX;
			$isBetterThanCurrentBest = false;

			foreach ( $daySlots as $assignedSlot ) {
				$gap = $slot->getGapDuration( $assignedSlot );
				if ( $gap >= 0 && $gap < $minGapThisSlot ) { // gap=0 means adjacent
					$minGapThisSlot = $gap;
				}
			}

			if ( $minGapThisSlot < $minOverallGap ) {
				$minOverallGap   = $minGapThisSlot;
				$bestSlotOverall = $slot;
			} elseif ( $bestSlotOverall === null ) { // Ensure a slot is picked if all have PHP_INT_MAX gap (e.g. first slot)
				$bestSlotOverall = $slot;
			}
		}
		return $bestSlotOverall; // This can be null if $validNonOverlappingSlots was empty
	}

	private function isSlotValidWithoutOverlap( TimeSlot $slotToCheck, array $currentAssignedSlots ): bool {
		foreach ( $currentAssignedSlots as $assignedSlot ) {
			if ( $slotToCheck->overlaps( $assignedSlot ) ) {
				return false;
			}
		}
		return true;
	}

	// Changed to accept Student object to get its duration easily
	private function tryReshuffleToFit( Student $newStudent, array $newStudentCandidateSlots, array $allPossibleSlots ): bool {
		$this->plannedReshuffles = []; // Clear previous plan

		foreach ( $newStudentCandidateSlots as $newProposedSlotForStudent ) {
			// Ensure this proposed slot has the correct duration for the student
			// The precalculateAllLessonSlots should have handled this, but good to be aware.
			// If newProposedSlotForStudent->duration !== newStudent->getLessonDuration(), it's an issue.
			// Assuming precalculateAllLessonSlots is correct.

			$conflictingAssignments = $this->findConflictingAssignments( $newProposedSlotForStudent );

			if ( empty( $conflictingAssignments ) ) {
				$this->assignSlot( $newStudent->id, $newProposedSlotForStudent );
				return true; // No conflicts, direct assignment possible
			}

			// Try to find alternative slots for all conflicting assignments
			if ( $this->canReshuffleConflictingAssignments( $conflictingAssignments, $allPossibleSlots, $newProposedSlotForStudent, $newStudent->id ) ) {
				// If successful, executeReshuffle will move conflicting ones, then assign the new student
				$this->executeReshuffle(); // Uses $this->plannedReshuffles
				$this->assignSlot( $newStudent->id, $newProposedSlotForStudent );
				echo "  -> Reshuffle successful for {$newStudent->name}.\n";
				return true;
			}
		}
		return false;
	}

	private function findConflictingAssignments( TimeSlot $proposedSlot ): array {
		$conflicts = [];
		// $schedule is studentId => TimeSlot
		$currentSchedule = $this->teacher->getSchedule();
		foreach ( $currentSchedule as $studentIdInSchedule => $assignedSlot ) {
			if ( $proposedSlot->overlaps( $assignedSlot ) ) {
				$conflicts[] = [
					'studentId' => $studentIdInSchedule,
					'slot'      => $assignedSlot, // This is a TimeSlot object
				];
			}
		}
		return $conflicts;
	}

	// Added $newStudentIdToExclude to prevent reshuffling a student into a slot that the new student wants,
	// or moving a student to conflict with another student being moved for the same new student.
	private function canReshuffleConflictingAssignments( array $conflictsToResolve, array $allPossibleSlots, TimeSlot $slotForNewStudent, string $newStudentIdToExclude ): bool {
		$tempPlannedReshuffles = [];

		foreach ( $conflictsToResolve as $conflict ) {
			$conflictingStudentId          = $conflict['studentId'];
			$conflictingStudentCurrentSlot = $conflict['slot']; // This is a TimeSlot object

			if ( ! isset( $this->students[ $conflictingStudentId ] ) ) {
				continue; // Should not happen
			}
			$conflictingStudentObj = $this->students[ $conflictingStudentId ];

			$studentCandidateSlots = $allPossibleSlots[ $conflictingStudentId ] ?? [];
			$foundAlternative      = false;
			foreach ( $studentCandidateSlots as $alternativeSlot ) {
				// Alternative must not be the one it's currently in
				if ( $this->slotsAreEqual( $alternativeSlot, $conflictingStudentCurrentSlot ) ) {
					continue;
				}
				// Alternative must not overlap with the slot the new student wants
				if ( $alternativeSlot->overlaps( $slotForNewStudent ) ) {
					continue;
				}

				// Check if this alternativeSlot conflicts with other *fixed* assignments
				// (not including those also in conflictsToResolve, and not the new student slot)
				$isValidAlternative = $this->isSlotValidForReshuffle( $alternativeSlot, $conflictsToResolve, $slotForNewStudent );

				if ( $isValidAlternative ) {
					$tempPlannedReshuffles[ $conflictingStudentId ] = $alternativeSlot;
					$foundAlternative                               = true;
					break; // Found one alternative for this conflicting student
				}
			}
			if ( ! $foundAlternative ) {
				$this->plannedReshuffles = []; // Clear partial plan
				return false; // Cannot find alternative for one of the conflicting students
			}
		}
		$this->plannedReshuffles = $tempPlannedReshuffles; // All conflicts can be resolved
		return true;
	}

	// Removed params as it uses $this->plannedReshuffles
	private function executeReshuffle(): void {
		// First, remove all students that are part of the current planned reshuffle
		foreach ( array_keys( $this->plannedReshuffles ) as $studentIdToMove ) {
			$this->removeStudentFromSchedule( $studentIdToMove );

			$schedule            = $this->teacher->getSchedule();
			$previousSlotDisplay = isset( $schedule[ $studentIdToMove ] ) ? $schedule[ $studentIdToMove ] : 'N/A before removal';
			echo "    -> Moved {$this->students[$studentIdToMove]->name} to make room (was at {$previousSlotDisplay}).\n";
		}
		// Then, re-assign them to their new planned slots
		foreach ( $this->plannedReshuffles as $studentIdToReassign => $newSlotForStudent ) {
			$this->assignSlot( $studentIdToReassign, $newSlotForStudent );
			echo "    -> Reassigned {$this->students[$studentIdToReassign]->name} to new slot {$newSlotForStudent}.\n";
		}
		$this->plannedReshuffles = []; // Clear after execution
	}

	// Added $slotForNewStudentToAvoid for checking when finding alternative slots
	private function isSlotValidForReshuffle( TimeSlot $slotToCheck, array $conflictsBeingMoved, TimeSlot $slotForNewStudentToAvoid ): bool {
		// Check against the slot the new student is trying to get
		if ( $slotToCheck->overlaps( $slotForNewStudentToAvoid ) ) {
			return false;
		}

		$currentSchedule         = $this->teacher->getSchedule();
		$idsOfStudentsBeingMoved = array_column( $conflictsBeingMoved, 'studentId' );

		foreach ( $currentSchedule as $studentIdInSchedule => $assignedSlot ) {
			// Don't check against students that are also part of this reshuffle batch,
			// as their old slots are conceptually "freeing up".
			if ( in_array( $studentIdInSchedule, $idsOfStudentsBeingMoved, true ) ) {
				continue;
			}
			// Check for overlap with other *fixed* students in the schedule
			if ( $slotToCheck->overlaps( $assignedSlot ) ) {
				return false;
			}
		}
		return true;
	}

	private function removeStudentFromSchedule( string $studentIdToRemove ): void {
		if ( ! isset( $this->students[ $studentIdToRemove ] ) ) {
			return;
		}

		$studentObj   = $this->students[ $studentIdToRemove ];
		$slotToRemove = $studentObj->getAssignedSlot();

		if ( $slotToRemove !== null ) {
			// Remove from teacher's main schedule
			unset( $this->teacher->schedule[ $studentIdToRemove ] );

			// Remove from day-specific tracking array
			// $slotToRemove->dayIndex is guaranteed to be valid (1-7) due to TimeSlot constructor
			$daySlots = &$this->assignedSlotsByDay[ $slotToRemove->dayIndex ];
			foreach ( $daySlots as $key => $scheduledSlotInDay ) {
				if ( $this->slotsAreEqual( $scheduledSlotInDay, $slotToRemove ) ) {
					array_splice( $daySlots, $key, 1 );
					break;
				}
			}
			$studentObj->setAssignedSlot( null ); // Unassign from student
		}
	}

	private function slotsAreEqual( TimeSlot $slot1, TimeSlot $slot2 ): bool {
		return $slot1->dayIndex === $slot2->dayIndex && // Compare dayIndex for efficiency
				$slot1->startTime === $slot2->startTime &&
				$slot1->endTime === $slot2->endTime;
	}

	private function assignSlot( string $studentId, TimeSlot $slot ): void {
		if ( ! isset( $this->students[ $studentId ] ) ) {
			return; // Safety check
		}

		$this->teacher->addToSchedule( $studentId, $slot );
		$this->students[ $studentId ]->setAssignedSlot( $slot );

		// $slot->dayIndex is guaranteed to be 1-7
		$this->assignedSlotsByDay[ $slot->dayIndex ][] = $slot;
		usort( // Keep the day's slots sorted by start time
			$this->assignedSlotsByDay[ $slot->dayIndex ],
			function ( TimeSlot $a, TimeSlot $b ): int {
				return $a->startTime <=> $b->startTime;
			}
		);
	}
}

// Wrapper class to set up the system from array data
class SchedulingSystem {
	public static function createFromArrayData( array $teacherData, array $studentsData ): DurationAwareScheduler {
		if ( ! isset( $teacherData['id'], $teacherData['name'], $teacherData['availability'] ) ) {
			throw new InvalidArgumentException( 'Teacher data is incomplete.' );
		}
		$teacher = new Teacher( $teacherData['id'], $teacherData['name'] );
		$teacher->setAvailabilityFromArray( $teacherData['availability'] ); // This now has basic validation

		$scheduler = new DurationAwareScheduler( $teacher );

		foreach ( $studentsData as $studentData ) {
			if ( ! isset( $studentData['id'], $studentData['name'], $studentData['duration'], $studentData['availability'] ) ) {
				error_log( 'Skipping student due to incomplete data: ' . ( $studentData['name'] ?? 'Unknown' ) );
				continue;
			}
			try {
				$student = new Student( $studentData['id'], $studentData['name'], (int) $studentData['duration'] );
				$student->setAvailabilityFromArray( $studentData['availability'] ); // Also has basic validation
				$scheduler->addStudent( $student );
			} catch ( InvalidArgumentException $e ) {
				error_log( "Error creating student {$studentData['name']}: " . $e->getMessage() );
			}
		}
		return $scheduler;
	}
}


// ===============================
// YOUR TEST DATA WITH DURATIONS
// (Using the one you provided in the script)
// ===============================

$teacherData = [
	'id'           => 1,
	'name'         => 'Teacher',
	'availability' => [
		'days'  => [ 'Monday', 'Tuesday', 'Wednesday' ],
		'times' => [
			'Monday'    => [
				[
					'start' => 720,
					'end'   => 1260,
				],
			], // 12:00-21:00
			'Tuesday'   => [
				[
					'start' => 720,
					'end'   => 1260,
				],
			], // 12:00-21:00
			'Wednesday' => [
				[
					'start' => 660,
					'end'   => 1260,
				],
			], // 11:00-21:00
		],
	],
];

$studentsData = array(
	0  =>
	array(
		'id'           => 'Bellmann Luan',
		'name'         => 'Bellmann Luan',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 810,
						'end'   => 960,
					),
				),
			),
		),
	),
	1  =>
	array(
		'id'           => 'Bhend Myles',
		'name'         => 'Bhend Myles',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
				1 => 'Monday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 675,
						'end'   => 715,
					),
					1 =>
					array(
						'start' => 990,
						'end'   => 1170,
					),
				),
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 1020,
						'end'   => 1200,
					),
				),
			),
		),
	),
	2  =>
	array(
		'id'           => 'Bleuer Lia',
		'name'         => 'Bleuer Lia',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 1050,
						'end'   => 1080,
					),
				),
			),
		),
	),
	3  =>
	array(
		'id'           => 'Bleuer Tim',
		'name'         => 'Bleuer Tim',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 1080,
						'end'   => 1110,
					),
				),
			),
		),
	),
	4  =>
	array(
		'id'           => 'Brandenberg Louan',
		'name'         => 'Brandenberg Louan',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
				1 => 'Wednesday',
			),
			'times' =>
			array(
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 870,
						'end'   => 910,
					),
					1 =>
					array(
						'start' => 930,
						'end'   => 1110,
					),
				),
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 795,
						'end'   => 975,
					),
				),
			),
		),
	),
	5  =>
	array(
		'id'           => 'Christen Noam',
		'name'         => 'Christen Noam',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 1110,
						'end'   => 1150,
					),
					1 =>
					array(
						'start' => 1050,
						'end'   => 1230,
					),
				),
			),
		),
	),
	6  =>
	array(
		'id'           => 'Delgado Eliel',
		'name'         => 'Delgado Eliel',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 945,
						'end'   => 1110,
					),
				),
			),
		),
	),
	7  =>
	array(
		'id'           => 'FlŸhmann Vincent',
		'name'         => 'FlŸhmann Vincent',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1070,
						'end'   => 1110,
					),
				),
			),
		),
	),
	8  =>
	array(
		'id'           => 'Gander Leana',
		'name'         => 'Gander Leana',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
				1 => 'Tuesday',
			),
			'times' =>
			array(
				'Monday'  =>
				array(
					0 =>
					array(
						'start' => 840,
						'end'   => 1020,
					),
				),
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 960,
						'end'   => 1140,
					),
				),
			),
		),
	),
	9  =>
	array(
		'id'           => 'Giandon Lina',
		'name'         => 'Giandon Lina',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1040,
						'end'   => 1070,
					),
				),
			),
		),
	),
	10 =>
	array(
		'id'           => 'Hunziker Ayleen',
		'name'         => 'Hunziker Ayleen',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
				1 => 'Wednesday',
			),
			'times' =>
			array(
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 930,
						'end'   => 960,
					),
				),
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 795,
						'end'   => 915,
					),
				),
			),
		),
	),
	11 =>
	array(
		'id'           => 'Ibrahimi Mahsa',
		'name'         => 'Ibrahimi Mahsa',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 880,
						'end'   => 920,
					),
					1 =>
					array(
						'start' => 780,
						'end'   => 880,
					),
				),
			),
		),
	),
	12 =>
	array(
		'id'           => 'Juillard Jonas',
		'name'         => 'Juillard Jonas',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
				1 => 'Monday',
				2 => 'Wednesday',
			),
			'times' =>
			array(
				'Tuesday'   =>
				array(
					0 =>
					array(
						'start' => 930,
						'end'   => 960,
					),
					1 =>
					array(
						'start' => 1080,
						'end'   => 1200,
					),
				),
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 1200,
						'end'   => 1380,
					),
				),
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 1125,
						'end'   => 1305,
					),
				),
			),
		),
	),
	13 =>
	array(
		'id'           => 'Klossner Liano',
		'name'         => 'Klossner Liano',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
				1 => 'Tuesday',
				2 => 'Wednesday',
			),
			'times' =>
			array(
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 810,
						'end'   => 930,
					),
				),
				'Tuesday'   =>
				array(
					0 =>
					array(
						'start' => 1140,
						'end'   => 1200,
					),
				),
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 840,
						'end'   => 885,
					),
				),
			),
		),
	),
	14 =>
	array(
		'id'           => 'Kluge Benjamin',
		'name'         => 'Kluge Benjamin',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
				1 => 'Wednesday',
			),
			'times' =>
			array(
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 975,
						'end'   => 1005,
					),
				),
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 810,
						'end'   => 1020,
					),
				),
			),
		),
	),
	15 =>
	array(
		'id'           => 'KneubŸhler Florine',
		'name'         => 'KneubŸhler Florine',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
				1 => 'Monday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 1000,
						'end'   => 1030,
					),
					1 =>
					array(
						'start' => 810,
						'end'   => 870,
					),
					2 =>
					array(
						'start' => 990,
						'end'   => 1170,
					),
				),
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 1020,
						'end'   => 1200,
					),
				),
			),
		),
	),
	16 =>
	array(
		'id'           => 'Kobelt Carla',
		'name'         => 'Kobelt Carla',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 810,
						'end'   => 990,
					),
				),
			),
		),
	),
	17 =>
	array(
		'id'           => 'Konrad Dean',
		'name'         => 'Konrad Dean',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 960,
						'end'   => 1000,
					),
					1 =>
					array(
						'start' => 1005,
						'end'   => 1050,
					),
				),
			),
		),
	),
	18 =>
	array(
		'id'           => 'KŸenzi Livia',
		'name'         => 'KŸenzi Livia',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 960,
						'end'   => 1000,
					),
					1 =>
					array(
						'start' => 1020,
						'end'   => 1200,
					),
				),
			),
		),
	),
	19 =>
	array(
		'id'           => 'Lauber Tim',
		'name'         => 'Lauber Tim',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 840,
						'end'   => 870,
					),
					1 =>
					array(
						'start' => 850,
						'end'   => 1020,
					),
				),
			),
		),
	),
	20 =>
	array(
		'id'           => 'MŸller Jakob',
		'name'         => 'MŸller Jakob',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1020,
						'end'   => 1125,
					),
				),
			),
		),
	),
	21 =>
	array(
		'id'           => 'Muri Marlen',
		'name'         => 'Muri Marlen',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
				1 => 'Monday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 850,
						'end'   => 880,
					),
					1 =>
					array(
						'start' => 810,
						'end'   => 870,
					),
				),
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 960,
						'end'   => 1080,
					),
				),
			),
		),
	),
	22 =>
	array(
		'id'           => 'Reutebuch Luiz',
		'name'         => 'Reutebuch Luiz',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1110,
						'end'   => 1150,
					),
				),
			),
		),
	),
	23 =>
	array(
		'id'           => 'Riesen Nils Levin',
		'name'         => 'Riesen Nils Levin',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1000,
						'end'   => 1040,
					),
					1 =>
					array(
						'start' => 1020,
						'end'   => 1200,
					),
				),
			),
		),
	),
	24 =>
	array(
		'id'           => 'Rohr Michelle',
		'name'         => 'Rohr Michelle',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Tuesday',
			),
			'times' =>
			array(
				'Tuesday' =>
				array(
					0 =>
					array(
						'start' => 1020,
						'end'   => 1140,
					),
				),
			),
		),
	),
	25 =>
	array(
		'id'           => 'RŸfenacht Sabrina',
		'name'         => 'RŸfenacht Sabrina',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 930,
						'end'   => 960,
					),
				),
			),
		),
	),
	26 =>
	array(
		'id'           => 'Schneider Anina Leena',
		'name'         => 'Schneider Anina Leena',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 840,
						'end'   => 1020,
					),
				),
			),
		),
	),
	27 =>
	array(
		'id'           => 'Studer Tyl',
		'name'         => 'Studer Tyl',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 810,
						'end'   => 840,
					),
					1 =>
					array(
						'start' => 780,
						'end'   => 1140,
					),
				),
			),
		),
	),
	28 =>
	array(
		'id'           => 'Topalli Ana Nora',
		'name'         => 'Topalli Ana Nora',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Monday',
			),
			'times' =>
			array(
				'Monday' =>
				array(
					0 =>
					array(
						'start' => 780,
						'end'   => 810,
					),
				),
			),
		),
	),
	29 =>
	array(
		'id'           => 'Von Gunten Timeo',
		'name'         => 'Von Gunten Timeo',
		'duration'     => 30,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 720,
						'end'   => 750,
					),
				),
			),
		),
	),
	30 =>
	array(
		'id'           => 'Wildi Marlon',
		'name'         => 'Wildi Marlon',
		'duration'     => 40,
		'availability' =>
		array(
			'days'  =>
			array(
				0 => 'Wednesday',
				1 => 'Monday',
			),
			'times' =>
			array(
				'Wednesday' =>
				array(
					0 =>
					array(
						'start' => 780,
						'end'   => 820,
					),
					1 =>
					array(
						'start' => 790,
						'end'   => 870,
					),
				),
				'Monday'    =>
				array(
					0 =>
					array(
						'start' => 935,
						'end'   => 1020,
					),
				),
			),
		),
	),
);


// ===============================
// RUN THE TEST
// ===============================
echo "=== DURATION-AWARE SCHEDULING TEST WITH RESHUFFLING ===\n";
echo "Teacher availability: Mon 12:00-21:00, Tue 12:00-21:00, Wed 11:00-21:00\n";
echo 'Students to schedule: ' . count( $studentsData ) . "\n";

$durationCounts = [];
foreach ( $studentsData as $student ) {
	$duration                    = $student['duration'];
	$durationCounts[ $duration ] = ( $durationCounts[ $duration ] ?? 0 ) + 1;
}
echo 'Lesson durations: ';
foreach ( $durationCounts as $duration => $count ) {
	echo "{$count}x{$duration}min ";
}
echo "\n\n";

$scriptStartTime = microtime( true );

try {
	$scheduler       = SchedulingSystem::createFromArrayData( $teacherData, $studentsData );
	$optimalSchedule = $scheduler->calculateOptimalSchedule(); // This has its own timer log

	$executionTime = microtime( true ) - $scriptStartTime;

	echo "\n=== RESULTS ===\n";
	echo 'Total script execution time: ' . round( $executionTime, 2 ) . " seconds\n";
	echo 'Students processed in input: ' . count( $studentsData ) . "\n";
	echo 'Assignments made: ' . count( $optimalSchedule ) . "\n\n";

	if ( empty( $optimalSchedule ) ) {
		echo "No schedule could be generated with assignments.\n";
	} else {
		echo "=== FINAL SCHEDULE ===\n";
		foreach ( $optimalSchedule as $appointment ) {
			echo $appointment['studentId'] . ' - ' .
				$appointment['day'] . ' ' .
				DurationAwareScheduler::formatMinutesToTime( $appointment['startTime'] ) . '-' .
				DurationAwareScheduler::formatMinutesToTime( $appointment['endTime'] ) .
				" ({$appointment['duration']} min)\n";
		}

		// Verify no overlaps
		echo "\n=== OVERLAP CHECK ===\n";
		$hasOverlaps = false;
		if ( count( $optimalSchedule ) > 1 ) { // Only check if there's more than one appointment
			for ( $i = 0; $i < count( $optimalSchedule ); $i++ ) {
				for ( $j = $i + 1; $j < count( $optimalSchedule ); $j++ ) {
					$slot1Data = $optimalSchedule[ $i ];
					$slot2Data = $optimalSchedule[ $j ];

					// Need to create TimeSlot objects to use the overlaps method,
					// or replicate overlap logic here.
					// For simplicity, replicating logic:
					if ( $slot1Data['day'] === $slot2Data['day'] &&
						$slot1Data['startTime'] < $slot2Data['endTime'] &&
						$slot1Data['endTime'] > $slot2Data['startTime'] ) {
						echo "OVERLAP DETECTED: {$slot1Data['studentId']} and {$slot2Data['studentId']} on {$slot1Data['day']}\n";
						$hasOverlaps = true;
					}
				}
			}
		}
		if ( ! $hasOverlaps ) {
			echo "-> No overlaps detected - schedule is valid!\n";
		}
	}
} catch ( InvalidArgumentException $e ) { // Catch specific expected exceptions
	echo 'ERROR (InvalidArgumentException): ' . $e->getMessage() . "\n";
	// print_r($e->getTraceAsString()); // For debugging
} catch ( Exception $e ) { // Catch any other unexpected exceptions
	echo 'UNEXPECTED ERROR: ' . $e->getMessage() . "\n";
	// print_r($e->getTraceAsString()); // For debugging
}
