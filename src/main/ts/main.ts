import "../scss/style.scss";
import "billboard.js/dist/billboard.css";
import { Popover } from "bootstrap";
import { loadData as snLoadData, setupSolarNetworkIntegration } from "./sn.ts";
import { SnSettingsFormElements } from "./forms";
import { replaceData } from "./utils";

const snSettingsForm =
	document.querySelector<HTMLFormElement>("#data-sn-settings")!;
const snSettings = snSettingsForm.elements as unknown as SnSettingsFormElements;

const generateChartButton = document.querySelector<HTMLButtonElement>(
	"#generate-chart-button"
)!;
// populate app version and then display it
replaceData(document.querySelector<HTMLElement>("#app-version")!, {
	"app-version": APP_VERSION,
}).classList.add("d-md-block");

// enable popovers
document
	.querySelectorAll('[data-bs-toggle="popover"]')
	.forEach((el) => new Popover(el));

// calculate!
generateChartButton.addEventListener("click", () => {
	snLoadData()
		.then((datum) => {
			import("./charts.ts").then(({ renderCharts }) => {
				renderCharts(datum, {
					propName: snSettings.snDatumProperty.value,
					scale: snSettings.snDatumPropertyScale.valueAsNumber,
				});
			});
		})
		.catch((reason) => {
			console.error("Error generating chart: %s", reason);
		});
});

setupSolarNetworkIntegration(snSettings);

snSettingsForm.addEventListener("change", enableChartGeneration);

function enableChartGeneration() {
	generateChartButton.disabled = !(
		snSettings.startDate.valueAsDate &&
		snSettings.endDate.valueAsDate &&
		snSettings.snToken.value &&
		snSettings.snTokenSecret.value &&
		snSettings.snNodeId.value &&
		snSettings.snSourceId.selectedIndex > 0 &&
		snSettings.snDatumProperty.selectedIndex > 0
	);
}
