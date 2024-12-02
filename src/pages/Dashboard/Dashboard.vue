<script setup>
import axios from "axios";
import numeral, { options } from "numeral";
import dayjs from "dayjs";
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { MagicString } from "vue/compiler-sfc";
import { color } from "echarts";

import DatePicker from "primevue/datepicker";
const Select = defineAsyncComponent(() => import("primevue/select"));
const Spinner = defineAsyncComponent(() => import("@/components/Spinner.vue"));

const ordersData = ref(null);
const salesRevenue = ref(null);
const params = ref(null);
const noOfCustomers = ref(null);
const avgTxnPrice = ref(null);
const avgUnitsPerCustomer = ref(null);
const salesByDivision = ref(null);
const customersByMonth = ref(null);
const customersByMonthOptions = ref(null);
const salesByCity = ref(null);
const salesByCityOptions = ref(null);
const productsInStock = ref(null);
const productsInStockOptions = ref(null);
const avgUnitsPriceByMonth = ref(null);
const avgUnitsPriceByMonthOptions = ref(null);
const isLoading = ref(false);

const divisionImagesArray = ref([
   "/images/southAmerica.jpeg",
   "/images/Scandinavia.jpeg",
   "/images/northAmerica.jpeg",
   "/images/europe.jpeg",
]);

const startDate = ref(null);
const endDate = ref(null);

const dateModel = ref(null);
const today = new Date("2009-12-01");
const month = today.getMonth();
const year = today.getFullYear();
const prevMonth = month === 0 ? 11 : month - 1;
const nextMonth = month === 11 ? 0 : month + 1;
const prevYear = prevMonth === 11 ? year - 1 : year;
const nextYear = nextMonth === 0 ? year + 1 : year;
const date = ref(null)
const maxDate =  ref(new Date())
const minDate =  ref(new Date())

minDate.value.setMonth(prevMonth);
minDate.value.setFullYear(prevMonth);
maxDate.value.setMonth(nextMonth);
maxDate.value.setFullYear(nextYear)


// Helper function for non-graphic Data

const fethcData = async (url, params) => {
   try {
      const result = await axios.post(url, params);
      return result.data;
  
   } catch (error) {
      console.log(error);
   }
};

// helper function end

// Calculator function

async function calculateSales() {
   salesRevenue.value = ordersData.value.reduce((sum, row) => {
      // console.log('row = ',sum)
      return sum + row.Quantity * row.UnitPrice;
   }, 0);
   avgTxnPrice.value = salesRevenue.value / ordersData.value.length;
   console.log("avg", avgTxnPrice);
}

//Calculator fxn end

// CustomerByMonth Graphic DataFxn

async function getCustomersByMonth() {
   try {
      const result = await axios.post(
         `${import.meta.env.VITE_FRONTEND_URL}customer-by-month`,
         params.value,
      );
      customersByMonth.value = result.data;
      await customersByMonthGraph();
   } catch (error) {
      console.log(error);
   }
}

// CustomerByMonth Fxn end

// customerByMonthGraph

async function customersByMonthGraph() {
   const x_data = customersByMonth.value.map((arr) => arr.order_month);
   const y_data = customersByMonth.value.map((arr) => arr.customers);

   customersByMonthOptions.value = {
      title: {
         text: "Customers by Month",
      },
      xAxis: {
         type: "category",
         data: x_data,
         axisLabel: {
            rotate: 45,
         },
      },
      yAxis: {
         type: "value",
      },
      series: [
         {
            data: y_data,
            type: "line",
         },
      ],
   };
}

// customer by month graph end

// Sales by citites Fxn start

async function getSalesByCity() {
   try {
      const result = await axios.post(
         `${import.meta.env.VITE_FRONTEND_URL}sales-by-city`,
         params.value,
      );
      salesByCity.value = result.data;
      await salesByCityGraph();
      console.log("i am done ", salesByCity);
   } catch (error) {
      console.log(error);
   }
}

//Sales by citites fxn end

//sales by city graph start

async function salesByCityGraph() {
   const topCities = salesByCity.value.slice(0, 5);
   const finalData = topCities.map((arr) => {
      return {
         value: numeral(arr.sales).format("0.0"),
         name: arr.City,
      };
   });

   salesByCityOptions.value = {
      title: {
         text: "Sales by City",
      },
      tooltip: {
         trigger: "item",
      },
      legend: {
         top: "10%",
         bottom: "20%",
         left: "center",
      },
      series: [
         {
            name: "Sales by City",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "60%"],
            avoidLabelOverlap: false,
            itemStyle: {
               borderRadius: 10,
               borderColor: "#fff",
               borderWidth: 2,
            },
            label: {
               show: false,
               position: "center",
            },
            emphasis: {
               label: {
                  show: true,
                  fontSize: 40,
                  fontWeight: "bold",
               },
            },
            labelLine: {
               show: false,
            },
            data: finalData,
         },
      ],
   };
}

// Products in stock fxt start

async function getProductsInStock(limit) {
   try {
      const result = await axios.get(
         `${import.meta.env.VITE_FRONTEND_URL}products-in-stock?limit=${limit}`,
      );
      console.log("result data = ", result.data);

      productsInStock.value = result.data;
      await productsInStockGraph();
   } catch (error) {
      console.log(error);
   }
}

// Products in stock fxn end

//Graph of products in stock starting

async function productsInStockGraph() {
   const x_data = productsInStock.value.map((arr) => arr.ProductName);
   const y_data = productsInStock.value.map((arr) => arr.UnitsInStock);

   productsInStockOptions.value = {
      grid: {
         bottom: 80, // Adjust the bottom space to give more room for x-axis labels
      },
      title: {
         text: "Count of Products In Stock",
      },
      xAxis: {
         type: "category",
         data: x_data,
         axisLabel: {
            rotate: 45,
         },
      },
      yAxis: {
         type: "value",
      },
      series: [
         {
            data: y_data,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
               color: "rgba(180, 180, 180, 0.1)",
            },
            itemStyle: {
               color: "#3399ff",
            },
         },
      ],
   };
}

// Graph of products in stock ending

// Avg Units Price Per Month Fxn START

async function getAvgUnitPriceByMonths() {
   try {
      const result = await axios.post(
         `
        ${import.meta.env.VITE_FRONTEND_URL}avg-units-price-by-month`,
         params.value,
      );
      avgUnitsPriceByMonth.value = result.data;
      await avgUnitPriceByMonthGraph();
   } catch (error) {
      console.log(error);
   }
}

// Avg Units Price Per Month Fxn END

// Avg Units Price Per Month Graph

async function avgUnitPriceByMonthGraph() {
   const avgPrice = avgUnitsPriceByMonth.value.map((arr) =>
      numeral(arr.avgprice).format("0,0.0"),
   );
   const avgUnits = avgUnitsPriceByMonth.value.map((arr) =>
      numeral(arr.avgunits).format("0,0.0"),
   );
   const x_data = avgUnitsPriceByMonth.value.map((arr) => arr.order_month);
   avgUnitsPriceByMonthOptions.value = {
      title: {
         text: "Average Price & Units By Months",
      },
      xAxis: {
         type: "category",
         boundaryGap: false,
         data: x_data,
      },
      yAxis: {
         type: "value",
         min: 0,
         max: 60,
         interval: 10,
         boundaryGap: [10, 10],
      },
      series: [
         {
            name: "Avg Price",
            type: "line",
            data: avgPrice,
         },
         {
            name: "Avg Units",
            type: "line",
            data: avgUnits,
         },
      ],
   };
}

watch(dateModel, (newValue, oldValue) => {
   startDate.value = dayjs(newValue[0].format("YYYY-MM-DD"));
   endDate.value = dayjs(newValue[1].format("YYYY-MM-DD"))
})

async function refreshDashboard() {
 

   params.value = {
      startDate: startDate.value,
      endDate: endDate.value,
   };

   ordersData.value = await fethcData(
      `${import.meta.env.VITE_FRONTEND_URL}sales-revenue`,
      params.value,
   );
   salesByCity.value = await fethcData(
      `${import.meta.env.VITE_FRONTEND_URL}sales-by-city`,
      params.value,
   );

   salesByDivision.value = await fethcData(
      `${import.meta.env.VITE_FRONTEND_URL}sales-by-division`,
      params.value,
   );

   avgUnitsPerCustomer.value = await fethcData(
      `${import.meta.env.VITE_FRONTEND_URL}avg-units-per-customer`,
      params.value,
   ).then((result) => {
      return result.avgUnitsPerCustomer;
   });

   noOfCustomers.value = [
      ...new Set(ordersData.value.map((row) => row.CustomerID)),
   ].length;

   await calculateSales();
   await getCustomersByMonth();
   await getSalesByCity();
   await getProductsInStock(10);
   await getAvgUnitPriceByMonths();
   isLoading.value = true;
}

onMounted(async () => {
   await refreshDashboard();
});
</script>
<template>
   <div class="tw-flex tw-w-full tw-p-2 tw-justify-center tw-items-center tw-h-full" >
      <Spinner v-if="!isLoading" />
      <div class="tw-flex tw-w-full tw-p-2 tw-justify-center tw-items-center" v-else>
        
         <div class="tw-m-1 tw-flex tw-w-1/2 tw-flex-col tw-items-center tw-p-2">
            <div
               class="tw-w-2/5 tw-rounded-md tw-bg-[#1b9e3e] tw-p-1 tw-text-center tw-text-lg tw-font-semibold tw-text-white">
               Overview
            </div>
            <div class="tw-m-1 tw-flex tw-w-full tw-p-1">
               <div
                  class="box1 tw-m-1 tw-flex tw-w-1/4 tw-flex-col tw-gap-2 tw-rounded-md tw-p-1 tw-py-11 tw-text-center tw-font-semibold tw-text-white tw-shadow-md">
                  {{ numeral(salesRevenue).format("0,0.00") }}
                  <span>Sales Revenue</span>
               </div>
               <div
                  class="box2 tw-m-1 tw-flex tw-w-1/4 tw-flex-col tw-gap-2 tw-rounded-md tw-p-1 tw-py-11 tw-text-center tw-font-semibold tw-text-white tw-shadow-md">
                  {{ noOfCustomers }}
                  <span>Customers Involved</span>
               </div>
               <div
                  class="box3 tw-m-1 tw-flex tw-w-1/4 tw-flex-col tw-gap-2 tw-rounded-md tw-p-1 tw-py-11 tw-text-center tw-font-semibold tw-text-white tw-shadow-md">
                  {{ numeral(avgTxnPrice).format("0,0.00") }}
                  <span>Avg.Txn.Price</span>
               </div>
               <div
                  class="box4 tw-m-1 tw-flex tw-w-1/4 tw-flex-col tw-gap-2 tw-rounded-md tw-p-1 tw-py-11 tw-text-center tw-font-semibold tw-text-white tw-shadow-md">
                  {{ numeral(avgUnitsPerCustomer).format("0,0.00") }}
                  <span>Avg Units Per Customer</span>
               </div>
            </div>
            <div class="tw-m-1 tw-h-80 tw-w-full tw-p-1">
               <div
                  class="tw-h-[300px] tw-w-11/12 tw-rounded-md tw-p-4 tw-shadow-2xl">
                  <v-chart :option="customersByMonthOptions"></v-chart>
               </div>
            </div>
            <div class="tw-m-1 tw-w-full tw-p-1">
               <div
                  class="tw-h-[400px] tw-w-11/12 tw-rounded-md tw-p-4 tw-shadow-2xl">
                  <v-chart :option="productsInStockOptions"></v-chart>
               </div>
            </div>
         </div>
         <div
            class="tw-flex tw-w-1/2 tw-flex-col tw-items-center tw-justify-center tw-p-2">
            <div
               class="tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-around">
               <div
                  class="tw-m-2 tw-w-2/5 tw-rounded-md tw-bg-[#1b9e3e] tw-p-1 tw-text-center tw-text-lg tw-font-semibold tw-text-white">
                  Sales by Division
               </div>
               <div class="tw-flex tw-w-full">
                  <div
                     v-for="(division, index) in salesByDivision"
                     :key="index"
                     class="tw-flex tw-w-1/4 tw-flex-col tw-text-center">
                     <img
                        class="tw-h-32 tw-w-11/12 tw-rounded-tl-lg tw-rounded-tr-lg"
                        :src="divisionImagesArray[index]"
                        alt="" />
                     <span class="tw-block tw-w-11/12 tw-bg-slate-100">
                        Sales - {{ numeral(division.sales).format("0,0.0") }}
                     </span>
                     <span
                        class="tw-block tw-w-11/12 tw-rounded-bl-lg tw-rounded-br-lg tw-bg-slate-100">
                        {{ division.DivisionName }}
                     </span>
                  </div>
               </div>
               <div
                  class="tw-m-1 tw-flex tw-w-full tw-flex-col tw-items-center tw-gap-6 tw-p-1">
                  <div
                     class="tw-h-[300px] tw-w-11/12 tw-rounded-md tw-p-4 tw-shadow-2xl">
                     <v-chart :option="salesByCityOptions"></v-chart>
                  </div>
                  <div
                     class="tw-h-[400px] tw-w-11/12 tw-rounded-md tw-p-4 tw-shadow-2xl">
                     <v-chart :option="avgUnitsPriceByMonthOptions"></v-chart>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<style scoped>
.box1 {
   background-color: #5856d6;
}
.box2 {
   background-color: #e55353;
}
.box3 {
   background-color: #f6af15;
}
.box4 {
   background-color: #3399ff;
}
</style>
