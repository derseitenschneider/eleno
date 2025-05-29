<?php


class TimeSlot {
	public string $day;
	public int $startTime; // in minutes from midnight
	public int $endTime;   // in minutes from midnight
	public int $duration;
	public int $dayIndex; // For sorting and comparison

	private static array $dayMap = [
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
			// Allow zero-duration slots if that's a possible outcome of parsing,
			// but Student::addAvailability will filter them if they are shorter than lesson.
			// For general TimeSlot, it might be valid, but for lessons, duration > 0.
			// Let's be strict for clarity here, assuming slots always have duration.
			if ( $startTime === $endTime && $startTime === 0 && $day === 'Monday' ) {
				/* common initial value, maybe allow? */ } elseif ( $startTime === $endTime ) {
				/* zero duration slots are often problematic */ }
				// For now, let's stick to start must be < end for a valid "period"
				// throw new InvalidArgumentException("Start time ({$startTime}) must be strictly before end time ({$endTime}) for day {$day}.");
		}
		$this->day       = $day;
		$this->startTime = $startTime;
		$this->endTime   = $endTime;
		$this->duration  = $endTime - $startTime; // Will be 0 if startTime == endTime
		$this->dayIndex  = self::$dayMap[ $day ];
	}

	public function overlaps( TimeSlot $other ): bool {
		return $this->dayIndex === $other->dayIndex &&
				$this->startTime < $other->endTime &&
				$this->endTime > $other->startTime;
	}

	public function __toString(): string {
		return "{$this->day}[" . self::formatMinutesToTime( $this->startTime ) . '-' . self::formatMinutesToTime( $this->endTime ) . ']';
	}

	public static function formatMinutesToTime( int $minutes ): string {
		$hours = floor( $minutes / 60 );
		$mins  = $minutes % 60;
		return sprintf( '%02d:%02d', $hours, $mins );
	}
}

class Student {
	public string $id;
	public string $name;
	public int $duration; // Lesson duration in minutes
	public array $prioritizedAvailability = []; // [priorityLevel => [TimeSlot, ...], ...]

	public ?TimeSlot $currentPlacement = null;
	public ?int $currentPriorityUsed   = null;
	public bool $isLocked              = false;

	public function __construct( string $id, string $name, int $duration ) {
		$this->id       = $id;
		$this->name     = $name;
		$this->duration = $duration;
		for ( $i = 1; $i <= 5; $i++ ) { // Initialize priority levels we expect (1-5)
			$this->prioritizedAvailability[ $i ] = [];
		}
	}

	public function addAvailability( int $priority, TimeSlot $slot ) {
		if ( $slot->duration < $this->duration ) {
			// This availability window is too short for the lesson.
			// It might be a slot that exactly matches a shorter lesson, but if our lesson is longer,
			// we can't use this window as is.
			// The getPotentialLessonSlotsForPriority will handle fitting the lesson within it.
			// So, we should add the window itself.
		}
		if ( $priority < 1 ) {
			$priority = 1; // Basic sanity check
		}
		$this->prioritizedAvailability[ $priority ][] = $slot;
	}

	// Generates actual lesson-duration slots from wider availability windows for a given priority
	public function getPotentialLessonSlotsForPriority( int $priority ): array {
		$potentialSlots = [];
		if ( ! isset( $this->prioritizedAvailability[ $priority ] ) ) {
			return [];
		}
		foreach ( $this->prioritizedAvailability[ $priority ] as $availabilityWindow ) {
			if ( $availabilityWindow->duration < $this->duration ) {
				continue; // This window is too short to fit the lesson
			}
			// Increment by a suitable step, e.g., 5 or 15 minutes. Using 5 for flexibility.
			// This also correctly handles if availabilityWindow->duration == $this->duration (loop runs once)
			for ( $startTime = $availabilityWindow->startTime;
				$startTime <= ( $availabilityWindow->endTime - $this->duration );
				$startTime += 5 ) {
				try {
					$potentialSlots[] = new TimeSlot( $availabilityWindow->day, $startTime, $startTime + $this->duration );
				} catch ( InvalidArgumentException $e ) {
					/* Should not happen if logic is correct */ }
			}
		}
		// Sort these potential slots (e.g., by day then time) for consistent processing
		usort( $potentialSlots, fn( $a, $b ) => ( $a->dayIndex <=> $b->dayIndex ) ?: ( $a->startTime <=> $b->startTime ) );
		return $potentialSlots;
	}

	public function getTotalAvailabilitySlotsCount(): int {
		$count = 0;
		for ( $priority = 1; $priority <= 5; $priority++ ) { // Check all defined priority levels
			if ( ! isset( $this->prioritizedAvailability[ $priority ] ) ) {
				continue;
			}
			foreach ( $this->prioritizedAvailability[ $priority ] as $availabilityWindow ) {
				if ( $availabilityWindow->duration >= $this->duration ) {
					$possibleStartsInWindow = floor( ( $availabilityWindow->endTime - $availabilityWindow->startTime - $this->duration ) / 5 ) + 1;
					$count                 += $possibleStartsInWindow;
				}
			}
		}
		return $count;
	}
}

class Teacher {
	public string $id;
	public string $name;
	public array $availability = []; // Array of TimeSlot objects

	public function __construct( string $id, string $name ) {
		$this->id   = $id;
		$this->name = $name;
	}

	public function addAvailability( TimeSlot $slot ) {
		if ( $slot->duration > 0 ) { // Only add teacher slots that have actual duration
			$this->availability[] = $slot;
		}
	}

	public function isAvailable( TimeSlot $lessonSlot ): bool {
		if ( $lessonSlot->duration <= 0 ) {
			return false; // Cannot schedule a zero/negative duration lesson
		}
		foreach ( $this->availability as $teacherAvailableSlot ) {
			if ( $teacherAvailableSlot->dayIndex === $lessonSlot->dayIndex &&
				$teacherAvailableSlot->startTime <= $lessonSlot->startTime &&
				$teacherAvailableSlot->endTime >= $lessonSlot->endTime ) {
				return true; // Lesson fits entirely within this teacher slot
			}
		}
		return false;
	}
}


class PrioritySchedulerService {
	private Teacher $teacher;
	/** @var Student[] */
	private array $students;
	private array $schedule                  = []; // studentId => TimeSlot (current placement)
	private int $maxConflictResolutionRounds = 20; // Increased max attempts

	public function __construct( Teacher $teacher, array $students ) {
		$this->teacher = $teacher;

		usort(
			$students,
			function ( Student $a, Student $b ) {
				$countA = $a->getTotalAvailabilitySlotsCount();
				$countB = $b->getTotalAvailabilitySlotsCount();
				if ( $countA === $countB ) {
					return $b->duration <=> $a->duration;
				}
				return $countA <=> $countB;
			}
		);
		$this->students = $students; // Already sorted
	}

	public function calculateSchedule(): array {
		echo 'Starting Priority Scheduler with ' . count( $this->students ) . " students...\n";
		$this->schedule = []; // Clear previous schedule
		foreach ( $this->students as $s ) { // Reset student states
			$s->currentPlacement    = null;
			$s->currentPriorityUsed = null;
			$s->isLocked            = false;
		}

		$this->initialPlacement();
		$this->resolveConflictsIteratively();

		$finalFormattedSchedule = [];
		$placedCount            = 0;
		foreach ( $this->students as $student ) { // Iterate in sorted order for consistent output
			if ( $student->currentPlacement !== null ) {
				++$placedCount;
				$finalFormattedSchedule[] = [
					'studentName'  => $student->name,
					'day'          => $student->currentPlacement->day,
					'startTime'    => TimeSlot::formatMinutesToTime( $student->currentPlacement->startTime ),
					'endTime'      => TimeSlot::formatMinutesToTime( $student->currentPlacement->endTime ),
					'priorityUsed' => $student->currentPriorityUsed,
					'isLocked'     => $student->isLocked,
				];
			}
		}

		// Sort final schedule for display
		usort(
			$finalFormattedSchedule,
			function ( $a, $b ) {
				$dayMap    = [
					'Monday'    => 1,
					'Tuesday'   => 2,
					'Wednesday' => 3,
					'Thursday'  => 4,
					'Friday'    => 5,
					'Saturday'  => 6,
					'Sunday'    => 7,
				];
				$dayIndexA = $dayMap[ $a['day'] ] ?? 0;
				$dayIndexB = $dayMap[ $b['day'] ] ?? 0;
				if ( $dayIndexA === $dayIndexB ) {
					// Convert HH:MM back to minutes for comparison or compare strings directly
					$timeA = (int) substr( $a['startTime'], 0, 2 ) * 60 + (int) substr( $a['startTime'], 3, 2 );
					$timeB = (int) substr( $b['startTime'], 0, 2 ) * 60 + (int) substr( $b['startTime'], 3, 2 );
					return $timeA <=> $timeB;
				}
				return $dayIndexA <=> $dayIndexB;
			}
		);

		echo "Scheduler finished. Placed {$placedCount} out of " . count( $this->students ) . " students.\n";
		$unplacedStudents = [];
		foreach ( $this->students as $student ) {
			if ( $student->currentPlacement === null ) {
				$unplacedStudents[] = $student->name . ' (P-Slots: ' . $student->getTotalAvailabilitySlotsCount() . ')';
			}
		}
		if ( ! empty( $unplacedStudents ) ) {
			echo 'Unplaced students: ' . implode( ', ', $unplacedStudents ) . "\n";
		}

		return $finalFormattedSchedule;
	}

	private function initialPlacement(): void {
		echo "Phase 1: Initial Placement (Trying highest priorities)...\n";
		foreach ( $this->students as $student ) {
			if ( $student->isLocked || $student->currentPlacement !== null ) {
				continue;
			}

			// Try to place with P1, then P2, etc. up to a reasonable limit (e.g., P5)
			for ( $priority = 1; $priority <= 5; $priority++ ) {
				$potentialSlots = $student->getPotentialLessonSlotsForPriority( $priority );
				if ( empty( $potentialSlots ) && $priority > 1 && ! isset( $student->prioritizedAvailability[ $priority + 1 ] ) ) {
					// No slots for this priority, and no further priorities defined for student
					// This inner break is for priorities for *this specific student*
					break;
				}
				if ( empty( $potentialSlots ) ) {
					continue; // No slots for *this* specific priority level
				}

				foreach ( $potentialSlots as $slot ) {
					if ( $this->tryPlaceStudent( $student, $slot, $priority ) ) {
						echo "  Placed {$student->name} in P{$priority} slot: {$slot}\n";
						if ( $student->getTotalAvailabilitySlotsCount() <= 1 ) { // Basic Lock: If only 1 (or very few) overall choices
							if ( count( $student->getPotentialLessonSlotsForPriority( $priority ) ) == 1 && $priority == count( $student->prioritizedAvailability ) ) {
								// If this was the only slot in their last available priority tier
								$student->isLocked = true;
								echo "    -> Locked {$student->name} (only/last option used).\n";
							}
						}
						goto nextStudentInitialPlacement; // Placed this student, move to next student
					}
				}
			}
			nextStudentInitialPlacement:;
		}
	}

	private function tryPlaceStudent( Student $student, TimeSlot $slotToTry, int $priorityLevel, array $excludeStudentIds = [] ): bool {
		if ( $student->isLocked && $student->currentPlacement !== null && $student->currentPlacement === $slotToTry ) {
			return true; // Already locked in this exact slot
		}
		if ( $student->isLocked && $student->currentPlacement !== null && $student->currentPlacement !== $slotToTry ) {
			return false; // Locked elsewhere
		}

		if ( ! $this->teacher->isAvailable( $slotToTry ) ) {
			// echo "DEBUG: Teacher not available for {$student->name} at {$slotToTry}\n";
			return false;
		}

		foreach ( $this->schedule as $placedStudentId => $placedSlot ) {
			if ( $student->id === $placedStudentId ) {
				continue;
			}
			if ( in_array( $placedStudentId, $excludeStudentIds ) ) {
				continue; // If we are re-slotting, ignore those also being moved
			}

			if ( $slotToTry->overlaps( $placedSlot ) ) {
				// echo "DEBUG: Slot {$slotToTry} for {$student->name} overlaps with {$placedStudentId} at {$placedSlot}\n";
				return false; // Conflict
			}
		}

		// If student was already placed (e.g. during reshuffle), remove old placement
		if ( $student->currentPlacement !== null ) {
			$this->removeStudentFromScheduleById( $student->id, false ); // false: don't reset lock status during internal move
		}

		$this->schedule[ $student->id ] = $slotToTry;
		$student->currentPlacement      = $slotToTry;
		$student->currentPriorityUsed   = $priorityLevel;
		// echo "DEBUG: Successfully placed/moved {$student->name} to {$slotToTry} (P{$priorityLevel})\n";
		return true;
	}

	private function removeStudentFromScheduleById( string $studentId, bool $resetLock = true ): void {
		$student = $this->findStudentById( $studentId );
		if ( $student ) {
			$student->currentPlacement    = null;
			$student->currentPriorityUsed = null;
			if ( $resetLock ) {
				$student->isLocked = false;
			}
		}
		unset( $this->schedule[ $studentId ] );
	}

	private function resolveConflictsIteratively(): void {
		echo "Phase 2: Iterative Conflict Resolution...\n";
		for ( $round = 1; $round <= $this->maxConflictResolutionRounds; $round++ ) {
			$conflicts = $this->findAllConflicts();
			if ( empty( $conflicts ) ) {
				echo "  No conflicts found in round {$round}. Schedule considered stable.\n";
				return; // Exit if no conflicts
			}

			echo "  Resolution Round {$round} - Found " . count( $conflicts ) . " conflicting student pairs.\n";
			$scheduleChangedThisRound = false;

			foreach ( $conflicts as $conflictPair ) {
				$s1_id = $conflictPair[0];
				$s2_id = $conflictPair[1];

				$s1 = $this->findStudentById( $s1_id );
				$s2 = $this->findStudentById( $s2_id );

				if ( ! $s1 || ! $s2 || $s1->currentPlacement === null || $s2->currentPlacement === null ) {
					continue; // Should not happen if conflict found correctly
				}

				// Determine which student to try moving first.
				// Prefer moving non-locked students.
				// If both non-locked, or both locked, prefer moving the one with lower current priority (higher number).
				$tryMoveS1First = false;
				if ( $s1->isLocked && ! $s2->isLocked ) {
					$tryMoveS1First = false; // Try moving s2
				} elseif ( ! $s1->isLocked && $s2->isLocked ) {
					$tryMoveS1First = true; // Try moving s1
				} else { // Both locked or both not locked
					$tryMoveS1First = ( $s1->currentPriorityUsed ?? 0 ) >= ( $s2->currentPriorityUsed ?? 0 );
				}

				$studentToTryMoving = $tryMoveS1First ? $s1 : $s2;
				$otherStudent       = $tryMoveS1First ? $s2 : $s1;

				if ( $this->attemptReSlotStudent( $studentToTryMoving, [ $otherStudent->id ] ) ) {
					echo "    Moved {$studentToTryMoving->name} to resolve conflict with {$otherStudent->name}.\n";
					$scheduleChangedThisRound = true;
					// Since a change was made, break from this conflict list and re-evaluate all conflicts in the next round
					break;
				} elseif ( ! $otherStudent->isLocked && $this->attemptReSlotStudent( $otherStudent, [ $studentToTryMoving->id ] ) ) {
					// If first attempt failed, try moving the other student (if not locked)
					echo "    Moved {$otherStudent->name} to resolve conflict with {$studentToTryMoving->name}.\n";
					$scheduleChangedThisRound = true;
					break;
				} else {
					echo "    Could not resolve conflict between {$s1->name} and {$s2->name} by simple re-slotting this round.\n";
				}
			} // End foreach conflict

			if ( ! $scheduleChangedThisRound ) {
				echo "  No conflicts successfully resolved in round {$round}. Current rules might not resolve remaining conflicts.\n";
				// Consider more advanced strategies here if needed, e.g. trying to move a "locked" student as a last resort
				break; // Stop if no progress
			}
		} // End for round
		if ( $round > $this->maxConflictResolutionRounds ) {
			echo "  Reached max conflict resolution rounds.\n";
		}
	}

	// $excludeStudentIds: array of student IDs whose current slots should be ignored during overlap check (because they are being moved)
	private function attemptReSlotStudent( Student $student, array $excludeStudentIds = [] ): bool {
		if ( $student->isLocked ) {
			// echo "DEBUG: Attempted to move locked student {$student->name}, skipping.\n";
			return false;
		}

		$originalSlot     = $student->currentPlacement; // Should not be null if student is in a conflict
		$originalPriority = $student->currentPriorityUsed ?? 0; // Default to 0 if somehow null

		// Try next priorities for this student (e.g., P_current+1 up to P5)
		for ( $priorityToTry = $originalPriority + 1; $priorityToTry <= 5; $priorityToTry++ ) {
			$potentialSlots = $student->getPotentialLessonSlotsForPriority( $priorityToTry );
			foreach ( $potentialSlots as $newSlot ) {
				// Pass $excludeStudentIds to tryPlaceStudent
				if ( $this->tryPlaceStudent( $student, $newSlot, $priorityToTry, $excludeStudentIds ) ) {
					echo "      -> Reslotted {$student->name} from P{$originalPriority} to P{$priorityToTry} at {$newSlot}\n";
					// Lock if this new slot is a very constrained choice for this new priority
					if ( count( $potentialSlots ) == 1 && $priorityToTry == $this->getLastDefinedPriority( $student ) ) {
						$student->isLocked = true;
						echo "        -> Locked {$student->name} (moved to only/last option).\n";
					}
					return true; // Successfully moved
				}
			}
		}
		// If no higher priority worked, or if it was already P5, no move possible with this logic
		// Revert to original placement if it was temporarily removed in tryPlaceStudent for checking
		// (tryPlaceStudent now handles removing old placement only if a new one is successful)
		// If we are here, no valid new slot was found for the student. The student remains in their original conflicting slot.
		// echo "DEBUG: Failed to find alternative slot for {$student->name} (was P{$originalPriority})\n";
		return false;
	}

	private function getLastDefinedPriority( Student $student ): int {
		$maxP = 0;
		foreach ( $student->prioritizedAvailability as $p => $slots ) {
			if ( ! empty( $slots ) ) {
				$maxP = max( $maxP, $p );
			}
		}
		return $maxP > 0 ? $maxP : 1; // Default to 1 if no slots defined
	}


	private function findAllConflicts(): array {
		$conflicts             = []; // Store pairs of [studentId1, studentId2]
		$studentIdsInSchedule  = array_keys( $this->schedule );
		$numStudentsInSchedule = count( $studentIdsInSchedule );

		for ( $i = 0; $i < $numStudentsInSchedule; $i++ ) {
			for ( $j = $i + 1; $j < $numStudentsInSchedule; $j++ ) {
				$s1_id = $studentIdsInSchedule[ $i ];
				$s2_id = $studentIdsInSchedule[ $j ];

				// Ensure students still exist in the main students list (should always be true)
				// and have placements (which they should if they are keys in $this->schedule)
				$s1 = $this->findStudentById( $s1_id );
				$s2 = $this->findStudentById( $s2_id );

				if ( $s1 && $s2 && $s1->currentPlacement && $s2->currentPlacement ) {
					if ( $s1->currentPlacement->overlaps( $s2->currentPlacement ) ) {
						$conflicts[] = [ $s1_id, $s2_id ];
						// echo "    Conflict detected: {$s1->name} ({$s1->currentPlacement}) and {$s2->name} ({$s2->currentPlacement})\n";
					}
				}
			}
		}
		return $conflicts;
	}

	private function findStudentById( string $studentId ): ?Student {
		foreach ( $this->students as $student ) { // $this->students is array of Student objects
			if ( $student->id === $studentId ) {
				return $student;
			}
		}
		// Fallback if $this->students was keyed by ID (which it isn't in current __construct)
		// if (isset($this->students[$studentId])) return $this->students[$studentId];
		return null;
	}
}
