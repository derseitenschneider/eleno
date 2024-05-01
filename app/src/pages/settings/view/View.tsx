import DarkmodeToggle from "../../../components/ui/darkmodeToggle/DarkmodeToggle.component";
import "./view.style.scss";

export default function View() {
	return (
		<div className="view">
			<section className="section">
				<h3 className="heading-3">Ansicht</h3>

				<div className="container-controlls">
					<p>Erscheinungsbild (hell/dunkel)</p>
					<DarkmodeToggle />
				</div>
			</section>
		</div>
	);
}
