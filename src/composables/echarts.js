// src/echarts-setup.js
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
   TitleComponent,
   ToolboxComponent,
   TooltipComponent,
   LegendComponent,
   DatasetComponent,
   GridComponent,
} from "echarts/components";

export function setupECharts() {
   // Register necessary ECharts components globally
   use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      LegendComponent,
      DatasetComponent,
      GridComponent,
      LineChart,
      BarChart,
      PieChart,
      SVGRenderer,
   ]);
}


