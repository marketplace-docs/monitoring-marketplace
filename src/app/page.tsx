
"use client";
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ShoppingCart, Sun, Moon, Boxes, PackageCheck, SendHorizonal, Coins, Hourglass, User, Package, Truck, LineChart, BarChart, Clock, Upload, Download, Pencil, GripVertical, ChevronsLeft, ChevronsRight, Trash2, PlusCircle } from 'lucide-react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function Home() {
  const chartInstances = useRef<{ [key: string]: Chart }>({});
  const [pickerCount, setPickerCount] = useState(0);
  const [packerCount, setPackerCount] = useState(0);
  const [dispatcherCount, setDispatcherCount] = useState(0);
  const [forceRender, setForceRender] = useState(0);

  // Backlog pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  const backlogData = useRef<any[]>([]);
  const [isEditingBacklog, setIsEditingBacklog] = useState(false);
  const [backlogEdits, setBacklogEdits] = useState<any[]>([]);

  // These need to be refs to persist across re-renders without causing them
  const pickData = useRef<number[]>(Array(24).fill(0));
  const packData = useRef<number[]>(Array(24).fill(0));
  const shippedData = useRef<number[]>(Array(24).fill(0));
  const currentBacklogFilter = useRef('platform');
  const currentBacklogDataMode = useRef('count');
  const isInitialized = useRef(false);

  useEffect(() => {
    // This effect runs only once on the client side after mounting for initialization.
    const init = () => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            }

            const initialBacklogData = [
                { source: "Jung Saem Mool Official Store", platform: "Shopee Jung Saem Mool", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Amuse Official Store", platform: "Shopee Amuse", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Carasun.id Official Store", platform: "Shopee Carasun", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Ariul Official Store", platform: "Shopee Ariul", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Dr G Official Store", platform: "Shopee Dr G", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Im From Official Store", platform: "Shopee Im From", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "COSRX Official Store", platform: "Shopee COSRX", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Espoir Official Store", platform: "Shopee Espoir", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Mediheal Official Store", platform: "Shopee Mediheal", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Keana Official Store", platform: "Shopee Keana", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Lilla Baby Indonesia", platform: "Shopee Lilla Baby", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Lilla Official store", platform: "Shopee lilla", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Edit by Sociolla", platform: "Shopee", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Round Lab Official Store", platform: "Shopee Round Lab", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Speak To Me Official Store", platform: "Shopee Speak to me", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Sukin Official Store", platform: "Shopee Sukin", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Woshday Official Store", platform: "Shopee Woshday", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Gemistry Official Store", platform: "Shopee Gemistry", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Sungboon Editor Official Store", platform: "Shopee Sungboon Editor", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Derma Angel Official Store", platform: "Shopee Derma Angel", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "UIQ Official Store", platform: "Shopee UIQ", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "UB Mom Indonesia", platform: "Shopee UB Mom", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "Bioheal Official Store", platform: "Shopee Bioheal", payment_order: "0", marketplacePlatform: "Shopee" },
                { source: "COSRX Official Store", platform: "Lazada Cosrx", payment_order: "0", marketplacePlatform: "Lazada" },
                { source: "Lilla Official store", platform: "tiktok_lilla", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "COSRX Official Store", platform: "tiktok_cosrx", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "Carasun.id Official Store", platform: "tiktok_carasun", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "Derma Angel Official Store", platform: "tiktok_derma_angel", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "Lilla Baby Indonesia", platform: "tiktok_lilla_Baby", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "Edit by Sociolla", platform: "tiktok", payment_order: "0", marketplacePlatform: "Tiktok" },
                { source: "Round Lab Official Store", platform: "tiktok_roundlab", payment_order: "0", marketplacePlatform: "Tiktok" },
            ];
            
            backlogData.current = initialBacklogData;
            
            Chart.register(ChartDataLabels);
            createInputFields();
            setupCollapsible();
            setupEventListeners(initialBacklogData);
            
            updateDashboard();
        }
    };

    if (!isInitialized.current) {
        init();
        isInitialized.current = true;
    }

    return () => {
      if (typeof window !== 'undefined') {
        Object.values(chartInstances.current).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        chartInstances.current = {};
      }
    };
  }, []);

  useEffect(() => {
    // This effect runs whenever the data or pagination settings change.
    if (typeof window !== 'undefined' && isInitialized.current) {
        updateDashboard();
    }
  }, [currentPage, recordsPerPage, pickerCount, packerCount, dispatcherCount, forceRender]);

  const generateHours = () => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
          hours.push(`${String(i).padStart(2, '0')}:00`);
      }
      return hours;
  };
  
  const hours = generateHours();

  const showToast = (message: string, type: 'success' | 'error') => {
      const toastContainer = document.getElementById('toast-container');
      if (!toastContainer) return;
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerText = message;
      toastContainer.appendChild(toast);
      setTimeout(() => {
          toast.remove();
      }, 4000);
  };

  const exportCSV = (type: 'pick' | 'pack' | 'shipped') => {
      let data: number[], filename: string, headers: string[];
      if (type === 'pick') {
          data = pickData.current;
          filename = 'pick_data.csv';
          headers = ['Jam', 'Jumlah Order Picked'];
      } else if (type === 'pack') {
          data = packData.current;
          filename = 'pack_data.csv';
          headers = ['Jam', 'Jumlah Order Packed'];
      } else {
          data = shippedData.current;
          filename = 'shipped_data.csv';
          headers = ['Jam', 'Jumlah Order Shipped'];
      }

      let csvContent = headers.join(',') + '\n';
      hours.forEach((hour, index) => {
          csvContent += `${hour},${data[index] || 0}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const uploadCSV = (type: 'pick' | 'pack' | 'shipped') => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) {
              showToast('Upload dibatalkan', 'error');
              return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  const csvData = event.target?.result as string;
                  const lines = csvData.split('\n');
                  const newData = Array(hours.length).fill(0);
                  
                  lines.slice(1).forEach(line => {
                      const parts = line.split(',');
                      if (parts.length === 2) {
                          const hour = parts[0].trim();
                          const value = parseInt(parts[1].trim(), 10);
                          const index = hours.indexOf(hour);
                          if (index !== -1 && !isNaN(value)) {
                              newData[index] = value;
                          }
                      }
                  });

                  if (type === 'pick') pickData.current = [...newData];
                  else if (type === 'pack') packData.current = [...newData];
                  else if (type === 'shipped') shippedData.current = [...newData];
                  
                  updateDashboard();
                  showToast('Upload CSV berhasil!', 'success');
              } catch (error) {
                  showToast('Gagal memproses file CSV.', 'error');
              }
          };
          reader.readAsText(file);
      };
      fileInput.click();
  };

  const exportBacklogCSV = () => {
      const filename = 'backlog_data.csv';
      const headers = ['Store Name', 'Payment Order', 'Marketplace Store', 'Platform'];
      let csvContent = headers.join(',') + '\n';
      backlogData.current.forEach(item => {
          csvContent += `"${item.platform}","${item.payment_order}","${item.source}","${item.marketplacePlatform}"\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const uploadBacklogCSV = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv';
      fileInput.onchange = (e) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) {
              showToast('Upload dibatalkan', 'error');
              return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
              try {
                  const csvData = event.target?.result as string;
                  const lines = csvData.split('\n');
                  const newBacklogData: any[] = [];
                  
                  lines.slice(1).forEach(line => {
                      const parts = line.split(',');
                      if (parts.length >= 4) {
                          newBacklogData.push({
                              platform: parts[0].trim().replace(/"/g, ''),
                              payment_order: (parts[1].trim() && !isNaN(parseInt(parts[1].trim(), 10))) ? parts[1].trim() : "0", 
                              source: parts[2].trim().replace(/"/g, ''),
                              marketplacePlatform: parts[3].trim().replace(/"/g, ''),
                          });
                      }
                  });
                  backlogData.current = newBacklogData;
                  setCurrentPage(1); // Reset to first page
                  updateDashboard();
                  showToast('Upload CSV Backlog berhasil!', 'success');
              } catch (error) {
                  showToast('Gagal memproses file CSV.', 'error');
              }
          };
          reader.readAsText(file);
      };
      fileInput.click();
  };

  const handleManpowerSave = (type: 'picker' | 'packer' | 'dispatcher') => {
      const input = document.getElementById(`${type}-input`) as HTMLInputElement;
      if (input) {
          const value = parseInt(input.value, 10) || 0;
          if (type === 'picker') setPickerCount(value);
          if (type === 'packer') setPackerCount(value);
          if (type === 'dispatcher') setDispatcherCount(value);
          document.getElementById(`${type}-dialog-close`)?.click();
      }
  };

  const updateSummary = () => {
      const totalPickOrder = pickData.current.reduce((a, b) => a + b, 0);
      const totalPackOrder = packData.current.reduce((a, b) => a + b, 0);
      const totalShippedOrder = shippedData.current.reduce((a, b) => a + b, 0);
      const paymentOrders = backlogData.current.reduce((sum, item) => sum + (parseInt(item.payment_order, 10) || 0), 0);
      
      const totalStores = backlogData.current.length;
      
      const currentPickerCount = pickerCount;
      const currentPackerCount = packerCount;
      const currentDispatcherCount = dispatcherCount;

      const nonZeroPick = pickData.current.filter(v => v > 0).length || 1;
      const nonZeroPack = packData.current.filter(v => v > 0).length || 1;
      const nonZeroShipped = shippedData.current.filter(v => v > 0).length || 1;
      
      const inProgressOrders = totalPickOrder - totalPackOrder;
      
      const targetPick = 650;
      const targetPack = 525;
      const targetShipped = 515;

      const performancePicker = currentPickerCount > 0 ? Math.min(100, ((totalPickOrder / currentPickerCount) / targetPick) * 100) : 0;
      const performancePacker = currentPackerCount > 0 ? Math.min(100, ((totalPackOrder / currentPackerCount) / targetPack) * 100) : 0;
      const performanceShipped = currentDispatcherCount > 0 ? Math.min(100, ((totalShippedOrder / currentDispatcherCount) / targetShipped) * 100) : 0;

      const setText = (id: string, value: string | number) => {
          const el = document.getElementById(id);
          if (el) el.innerText = value.toLocaleString();
      }

      setText('total-pick-order', totalPickOrder);
      setText('total-packed-orders', totalPackOrder);
      setText('total-shipped-orders', totalShippedOrder);
      setText('payment-accepted-count', paymentOrders);
      setText('in-progress-orders', inProgressOrders);
      
      setText('picker-count-display', pickerCount);
      setText('packer-count-display', packerCount);
      setText('dispatcher-count-display', dispatcherCount);
      
      setText('average-pick-per-hour', Math.round(totalPickOrder / nonZeroPick));
      setText('average-pack-per-hour', Math.round(totalPackOrder / nonZeroPack));
      setText('average-shipped-per-hour', Math.round(totalShippedOrder / nonZeroShipped));
      
      setText('performance-picker-percentage', `${performancePicker.toFixed(2)}%`);
      setText('performance-packer-percentage', `${performancePacker.toFixed(2)}%`);
      setText('performance-shipped-percentage', `${performanceShipped.toFixed(2)}%`);
      
      const totalStoreEl = document.getElementById('total-store-count');
      if (totalStoreEl) totalStoreEl.textContent = totalStores.toLocaleString();
      const totalPaymentOrderEl = document.getElementById('total-payment-order');
      if (totalPaymentOrderEl) totalPaymentOrderEl.textContent = paymentOrders.toLocaleString();


      const updatePerfCard = (elementId: string, percentage: number) => {
          const el = document.getElementById(elementId);
          if (!el) return;
          el.classList.remove('bg-green-100', 'text-green-800', 'bg-yellow-100', 'text-yellow-800', 'bg-red-100', 'text-red-800', 'bg-gray-100', 'text-gray-800', 'bg-slate-500', 'text-white');
          el.classList.remove('dark:bg-green-900/50', 'dark:text-green-300', 'dark:bg-yellow-900/50', 'dark:text-yellow-300', 'dark:bg-red-900/50', 'dark:text-red-300', 'dark:bg-gray-700', 'dark:text-gray-300', 'dark:bg-slate-700', 'dark:text-white');
          
          if (percentage >= 100) {
              el.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900/50', 'dark:text-green-300');
          } else if (percentage >= 90) {
              el.classList.add('bg-yellow-100', 'text-yellow-800', 'dark:bg-yellow-900/50', 'dark:text-yellow-300');
          } else if (percentage > 0) {
              el.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900/50', 'dark:text-red-300');
          } else {
               el.classList.add('bg-slate-500', 'text-white', 'dark:bg-slate-700', 'dark:text-white');
          }
      };

      updatePerfCard('card-performance-picker', performancePicker);
      updatePerfCard('card-performance-packer', performancePacker);
      updatePerfCard('card-performance-shipped', performanceShipped);

      document.querySelectorAll('.total-pick-summary').forEach(el => el.textContent = totalPickOrder.toLocaleString());
      document.querySelectorAll('.total-pack-summary').forEach(el => el.textContent = totalPackOrder.toLocaleString());
      document.querySelectorAll('.total-shipped-summary').forEach(el => el.textContent = totalShippedOrder.toLocaleString());

  };

  const renderChart = (canvasId: string, chartType: 'bar' | 'line', labels: string[], data: number[], label: string, color: string | string[]) => {
      const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!ctx) return;

      if (chartInstances.current[canvasId]) {
          chartInstances.current[canvasId].destroy();
      }

      const isDarkMode = document.documentElement.classList.contains('dark');
      const textColor = isDarkMode ? '#e5e7eb' : '#374151';
      const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

      const maxValue = Math.max(...data, 0);
      const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.25) : 100;
      
      let stepSize;
      if (yAxisMax <= 100) {
          stepSize = 20;
      } else if (yAxisMax <= 500) {
          stepSize = 50;
      } else if (yAxisMax <= 1500){
          stepSize = 100;
      } else {
          stepSize = 200;
      }

      chartInstances.current[canvasId] = new Chart(ctx, {
          type: chartType,
          data: {
              labels: labels,
              datasets: [{
                  label: label,
                  data: data,
                  backgroundColor: color,
                  borderColor: color,
                  borderRadius: chartType === 'bar' ? 4 : undefined,
                  borderWidth: 1,
                  tension: 0.4,
                  fill: false,
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  x: { 
                      grid: { display: false },
                      ticks: { color: textColor }
                  },
                  y: { 
                      beginAtZero: true, 
                      grid: { color: gridColor },
                      max: yAxisMax,
                      ticks: {
                         stepSize: stepSize,
                         color: textColor
                      }
                  }
              },
              plugins: {
                  legend: { display: false },
                  datalabels: {
                      anchor: 'end',
                      align: 'top',
                      formatter: (value) => value > 0 ? value : null,
                      color: textColor,
                      font: { weight: 'bold' }
                  }
              }
          }
      });
  };
  
  const renderAllCharts = () => {
      const startPickHourEl = document.getElementById('pick-start-hour') as HTMLInputElement;
      if (!startPickHourEl) return; 

      const startPickHour = parseInt(startPickHourEl.value, 10);
      const endPickHour = parseInt((document.getElementById('pick-end-hour') as HTMLInputElement).value, 10);
      const filteredPickHours = hours.slice(startPickHour, endPickHour + 1);
      const filteredPickData = pickData.current.slice(startPickHour, endPickHour + 1);
      renderChart('pick-chart', 'bar', filteredPickHours, filteredPickData, 'Total Picked', '#ef4444');

      const startPackHour = parseInt((document.getElementById('pack-start-hour') as HTMLInputElement).value, 10);
      const endPackHour = parseInt((document.getElementById('pack-end-hour') as HTMLInputElement).value, 10);
      const filteredPackHours = hours.slice(startPackHour, endPackHour + 1);
      const filteredPackData = packData.current.slice(startPackHour, endPackHour + 1);
      renderChart('pack-chart', 'bar', filteredPackHours, filteredPackData, 'Total Packed', '#f59e0b');
      
      const startShippedHour = parseInt((document.getElementById('shipped-start-hour') as HTMLInputElement).value, 10);
      const endShippedHour = parseInt((document.getElementById('shipped-end-hour') as HTMLInputElement).value, 10);
      const filteredShippedHours = hours.slice(startShippedHour, endShippedHour + 1);
      const filteredShippedData = shippedData.current.slice(startShippedHour, endShippedHour + 1);
      renderChart('shipped-chart', 'bar', filteredShippedHours, filteredShippedData, 'Total Shipped', '#8b5cf6');

      const dataToFilter = currentBacklogFilter.current;
      const groupedData = backlogData.current.reduce((acc, item) => {
          const key = item[dataToFilter];
          let normalizedKey = key;
          if (dataToFilter === 'platform') {
              normalizedKey = key.toLowerCase().startsWith('shopee') ? 'Shopee' : (key.toLowerCase().startsWith('lazada') ? 'Lazada' : (key.toLowerCase().startsWith('tiktok') ? 'Tiktok' : key));
          } else if (dataToFilter === 'marketplacePlatform') {
               normalizedKey = item.marketplacePlatform;
          }
          
          if (currentBacklogDataMode.current === 'count') {
              acc[normalizedKey] = (acc[normalizedKey] || 0) + 1;
          } else {
              acc[normalizedKey] = (acc[normalizedKey] || 0) + (parseInt(item.payment_order, 10) || 0);
          }
          return acc;
      }, {});
      
      const backlogLabels = Object.keys(groupedData);
      const backlogValues = Object.values(groupedData) as number[];
      
      const isDarkMode = document.documentElement.classList.contains('dark');
      const backlogColors = backlogLabels.map(label => {
          const lowerLabel = label.toLowerCase();
          if (lowerLabel.includes('shopee')) return '#f97316';
          if (lowerLabel.includes('lazada')) return '#3b82f6';
          if (lowerLabel.includes('tiktok')) return isDarkMode ? '#1f2937' : '#374151';
          return '#34d399';
      });

      const chartLabel = currentBacklogDataMode.current === 'count' ? 'Count of Stores' : 'Total Payment Orders';
      const mainTitleEl = document.getElementById('backlog-chart-title-main');
      if (mainTitleEl) mainTitleEl.textContent = `Grafik Backlog`;
      
      const filterSelect = document.getElementById('backlog-filter') as HTMLSelectElement;
      if (filterSelect) {
        const selectedOption = filterSelect.options[filterSelect.selectedIndex];
        const filterTitleEl = document.getElementById('backlog-chart-title-filter');
        if (filterTitleEl) filterTitleEl.textContent = selectedOption.text;
      }
      renderChart('backlog-chart', 'bar', backlogLabels, backlogValues, chartLabel, backlogColors);
      
      // Update active state for new filter buttons
      const countButton = document.getElementById('chart-data-count-new');
      const paymentButton = document.getElementById('chart-data-payment-new');
      if (countButton && paymentButton) {
        if (currentBacklogDataMode.current === 'count') {
            countButton.classList.add('bg-indigo-100', 'dark:bg-indigo-900/50');
            paymentButton.classList.remove('bg-indigo-100', 'dark:bg-indigo-900/50');
        } else {
            paymentButton.classList.add('bg-indigo-100', 'dark:bg-indigo-900/50');
            countButton.classList.remove('bg-indigo-100', 'dark:bg-indigo-900/50');
        }
      }
  };

  const updateDashboard = () => {
      if (typeof window === 'undefined') return;
      updateInputFieldsValues();
      updateSummary();
      renderBacklogTable();
      renderAllCharts();
      setForceRender(c => c + 1);
  };

  const createInputFields = () => {
      const create = (containerId: string, className: string, dataType: 'pick' | 'pack' | 'shipped') => {
          const container = document.getElementById(containerId);
          if (!container) return;
          container.innerHTML = ''; 

          const row1 = document.createElement('div');
          row1.className = 'grid grid-cols-12 gap-x-2 gap-y-4';
          hours.slice(0, 12).forEach((hour, index) => {
              const div = document.createElement('div');
              div.className = 'text-center';
              div.innerHTML = `
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">${hour}</label>
                  <input type="number" data-index="${index}" class="${className} block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center py-1.5" value="0" min="0">
              `;
              row1.appendChild(div);
          });
          container.appendChild(row1);

          const row2 = document.createElement('div');
          row2.className = 'grid grid-cols-12 gap-x-2 gap-y-4 mt-4';
           hours.slice(12, 24).forEach((hour, i) => {
              const index = i + 12;
              const div = document.createElement('div');
              div.className = 'text-center';
              div.innerHTML = `
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">${hour}</label>
                  <input type="number" data-index="${index}" class="${className} block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center py-1.5" value="0" min="0">
              `;
              row2.appendChild(div);
          });
          container.appendChild(row2);


          container.querySelectorAll(`.${className}`).forEach(input => {
              input.addEventListener('input', (e) => {
                  const index = parseInt((e.target as HTMLInputElement).dataset.index!, 10);
                  const value = parseInt((e.target as HTMLInputElement).value, 10) || 0;
                  if (dataType === 'pick') pickData.current[index] = value;
                  else if (dataType === 'pack') packData.current[index] = value;
                  else if (dataType === 'shipped') shippedData.current[index] = value;
                  updateDashboard();
              });
          });
      };
      create('pick-input-container', 'pick-input', 'pick');
      create('pack-input-container', 'pack-input', 'pack');
      create('shipped-input-container', 'shipped-input', 'shipped');
  };

  const updateInputFieldsValues = () => {
      const update = (className: string, data: number[]) => {
          document.querySelectorAll(`.${className}`).forEach((input, index) => {
              (input as HTMLInputElement).value = (data[index] || 0).toString();
          });
      };
      update('pick-input', pickData.current);
      update('pack-input', packData.current);
      update('shipped-input', shippedData.current);
  };
  
  const handleBacklogEditChange = (index: number, field: string, value: string) => {
    const newEdits = [...backlogEdits];
    newEdits[index][field] = value;
    setBacklogEdits(newEdits);
  };

  const handleToggleEditBacklog = () => {
    if (isEditingBacklog) {
      // Logic to cancel edits
      setIsEditingBacklog(false);
      setBacklogEdits([]); // Discard changes
    } else {
      // Logic to start editing
      setBacklogEdits(JSON.parse(JSON.stringify(backlogData.current)));
      setIsEditingBacklog(true);
    }
  };
  
  const handleSaveBacklog = () => {
    backlogData.current = backlogEdits;
    setIsEditingBacklog(false);
    updateDashboard();
    showToast('Backlog updated successfully!', 'success');
  };
  
  const handleAddBacklogRow = () => {
    const newRow = { platform: '', payment_order: '0', source: '', marketplacePlatform: '' };
    setBacklogEdits([newRow, ...backlogEdits]);
  };
  
  const handleDeleteBacklogRow = (index: number) => {
    const newEdits = [...backlogEdits];
    newEdits.splice(index, 1);
    setBacklogEdits(newEdits);
  };


  const renderBacklogTable = () => {
      const tableBody = document.getElementById('backlog-table-body');
      if (!tableBody) return;
      tableBody.innerHTML = '';

      const dataToRender = isEditingBacklog ? backlogEdits : backlogData.current;
  
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = dataToRender.slice(indexOfFirstRecord, indexOfLastRecord);
  
      currentRecords.forEach((item, index) => {
          const originalIndex = indexOfFirstRecord + index;
          const row = document.createElement('tr');
          row.className = 'dark:border-gray-700';

          if (isEditingBacklog) {
            row.innerHTML = `
              <td class="px-3 py-2"><input class="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" value="${item.platform}" oninput="this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, field: 'platform', index: ${originalIndex} } }))"></td>
              <td class="px-3 py-2"><input class="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" type="number" value="${item.payment_order}" oninput="this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, field: 'payment_order', index: ${originalIndex} } }))"></td>
              <td class="px-3 py-2"><input class="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" value="${item.source}" oninput="this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, field: 'source', index: ${originalIndex} } }))"></td>
              <td class="px-3 py-2"><input class="w-full bg-gray-50 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600" value="${item.marketplacePlatform}" oninput="this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, field: 'marketplacePlatform', index: ${originalIndex} } }))"></td>
              <td class="px-3 py-2 text-center">
                <button class="text-red-500 hover:text-red-700" onclick="this.dispatchEvent(new CustomEvent('delete', { bubbles: true, detail: { index: ${originalIndex} } }))">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
              </td>
            `;
          } else {
            row.innerHTML = `
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.platform}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${parseInt(item.payment_order, 10).toLocaleString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.source}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.marketplacePlatform}</td>
            `;
          }
          tableBody.appendChild(row);
      });

      // Attach event listeners for edit mode
      if (isEditingBacklog) {
        tableBody.querySelectorAll('input').forEach(input => {
          input.addEventListener('change', (e: any) => {
            const { index, field, value } = e.detail;
            handleBacklogEditChange(index, field, value);
          });
        });
        tableBody.querySelectorAll('button').forEach(button => {
            button.addEventListener('delete', (e: any) => {
                const { index } = e.detail;
                handleDeleteBacklogRow(index);
            });
        });
      }
  
      const paginationInfo = document.getElementById('pagination-info');
      if (paginationInfo) {
          const start = dataToRender.length > 0 ? indexOfFirstRecord + 1 : 0;
          const end = Math.min(indexOfLastRecord, dataToRender.length);
          paginationInfo.textContent = `${start}-${end} of ${dataToRender.length}`;
      }
  
      const totalPages = Math.ceil(dataToRender.length / recordsPerPage);
      const firstPageBtn = document.getElementById('first-page-btn') as HTMLButtonElement | null;
      if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
      const prevPageBtn = document.getElementById('prev-page-btn') as HTMLButtonElement | null;
      if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
      const nextPageBtn = document.getElementById('next-page-btn') as HTMLButtonElement | null;
      if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
      const lastPageBtn = document.getElementById('last-page-btn') as HTMLButtonElement | null;
      if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
  };
  
  const setupCollapsible = () => {
      document.querySelectorAll('[data-collapsible-trigger]').forEach(trigger => {
          trigger.addEventListener('click', (event) => {
              const clickable = event.currentTarget as HTMLElement;
              const contentId = clickable.getAttribute('data-collapsible-trigger');
              if (!contentId) return;

              const targetEl = event.target as HTMLElement;
              if (targetEl.closest('button, a, input, select, [role="dialog"], [role="menu"]')) {
                  return;
              }

              const content = document.getElementById(contentId);
              const icon = clickable.querySelector('.lucide-chevron-down');

              if (content && icon) {
                  const isHidden = content.classList.contains('hidden');
                  content.classList.toggle('hidden');
                  icon.classList.toggle('rotate-180', !isHidden);
              }
          });
      });
  };

  const setupEventListeners = (initialBacklogData: any[]) => {
      (window as any).uploadCSV = uploadCSV;
      (window as any).exportCSV = exportCSV;
      (window as any).uploadBacklogCSV = uploadBacklogCSV;
      (window as any).exportBacklogCSV = exportBacklogCSV;
      (window as any).handleManpowerSave = handleManpowerSave;

      document.getElementById('theme-toggle')?.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
          updateDashboard();
      });

      ['pick-start-hour', 'pick-end-hour', 'pack-start-hour', 'pack-end-hour', 
       'shipped-start-hour', 'shipped-end-hour'].forEach(id => {
          const element = document.getElementById(id);
          if (element) {
              element.addEventListener('input', updateDashboard);
          }
      });

      document.getElementById('backlog-filter')?.addEventListener('change', (e) => {
          currentBacklogFilter.current = (e.target as HTMLSelectElement).value;
          updateDashboard();
      });
      
      const setupDataModeButton = (buttonId: string, dataMode: 'count' | 'payment') => {
          document.getElementById(buttonId)?.addEventListener('click', () => {
              currentBacklogDataMode.current = dataMode;
              updateDashboard();
          });
      };
      setupDataModeButton('chart-data-count-new', 'count');
      setupDataModeButton('chart-data-payment-new', 'payment');

      
      const recordsPerPageSelect = document.getElementById('backlog-records-per-page');
      if (recordsPerPageSelect) {
        recordsPerPageSelect.addEventListener('change', (e) => {
            setRecordsPerPage(Number((e.target as HTMLSelectElement).value));
            setCurrentPage(1);
        });
      }

      document.getElementById('first-page-btn')?.addEventListener('click', () => setCurrentPage(p => 1));
      document.getElementById('prev-page-btn')?.addEventListener('click', () => setCurrentPage(p => Math.max(1, p - 1)));
      document.getElementById('next-page-btn')?.addEventListener('click', () => {
          const dataToPaginate = isEditingBacklog ? backlogEdits : backlogData.current;
          const totalPages = Math.ceil(dataToPaginate.length / recordsPerPage);
          setCurrentPage(p => Math.min(totalPages, p + 1));
      });
      document.getElementById('last-page-btn')?.addEventListener('click', () => {
          const dataToPaginate = isEditingBacklog ? backlogEdits : backlogData.current;
          const totalPages = Math.ceil(dataToPaginate.length / recordsPerPage);
          setCurrentPage(totalPages);
      });
  };

  const ManpowerCard = ({
    type,
    title,
    icon,
    count,
  }: {
    type: 'picker' | 'packer' | 'dispatcher';
    title: string;
    icon: React.ReactNode;
    count: number;
  }) => (
    <Dialog>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <div className="flex items-center gap-2">
            {icon}
            <DialogTrigger asChild>
              <Pencil className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200" />
            </DialogTrigger>
          </div>
        </div>
        <div className="mt-1">
          <p id={`${type}-count-display`} className="text-2xl font-bold text-gray-800 dark:text-gray-100">{count}</p>
        </div>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
          <DialogDescription>
            Update the number of available {type}s. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={`${type}-input`} className="text-right">
              Total
            </Label>
            <Input id={`${type}-input`} type="number" defaultValue={count} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button id={`${type}-dialog-close`} type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={() => handleManpowerSave(type)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div id="app" className="w-full max-w-screen-2xl mx-auto space-y-6 p-4 sm:p-6">
            
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
                       <ShoppingCart className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                        Marketplace Dashboard
                    </h1>
                </div>
                <button id="theme-toggle" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Sun className="h-6 w-6 hidden dark:block text-yellow-400" />
                    <Moon className="h-6 w-6 block dark:hidden text-gray-700" />
                </button>
            </header>

            <div className="px-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">From payment to progress — only cleared orders move forward to pick, pack, and ship.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-red-500 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
                    <p className="text-sm font-medium opacity-90">Total Pick Order</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-bold" id="total-pick-order">0</p>
                        <Boxes className="w-8 h-8 opacity-50" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-yellow-500 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
                    <p className="text-sm font-medium opacity-90">Total Packed Order</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-bold" id="total-packed-orders">0</p>
                        <PackageCheck className="w-8 h-8 opacity-50" />
                    </div>
                </div>
                <div className="bg-purple-500 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
                    <p className="text-sm font-medium opacity-90">Total Shipped Order</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-bold" id="total-shipped-orders">0</p>
                        <SendHorizonal className="w-8 h-8 opacity-50" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Payment Accepted</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-bold text-gray-800 dark:text-gray-100" id="payment-accepted-count">0</p>
                        <Coins className="w-8 h-8 text-green-500 opacity-70" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">In Progress</p>
                     <div className="flex items-end justify-between mt-2">
                        <p className="text-4xl font-bold text-gray-800 dark:text-gray-100" id="in-progress-orders">0</p>
                        <Hourglass className="w-8 h-8 text-blue-500 opacity-70" />
                    </div>
                </div>
            </div>
                
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center cursor-pointer" data-collapsible-trigger="performance-content">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Marketplace Performance</h2>
                    <ChevronDown className="lucide-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300" />
                </div>
                <div id="performance-content" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 hidden">
                    <ManpowerCard type="picker" title="Jumlah Picker" icon={<User className="w-4 h-4 text-blue-500" />} count={pickerCount} />
                    <ManpowerCard type="packer" title="Jumlah Packer" icon={<Package className="w-4 h-4 text-green-500" />} count={packerCount} />
                    <ManpowerCard type="dispatcher" title="Jumlah Dispatcher" icon={<Truck className="w-4 h-4 text-blue-500" />} count={dispatcherCount} />
                    
                    <div id="card-performance-picker" className="p-4 rounded-lg flex justify-between items-center bg-slate-500 dark:bg-slate-700 text-white">
                        <div>
                            <p className="text-sm font-medium">Performance Picker</p>
                            <p className="text-2xl font-bold mt-1" id="performance-picker-percentage">0.00%</p>
                        </div>
                        <LineChart className="w-7 h-7 opacity-70" />
                    </div>
                    <div id="card-performance-packer" className="p-4 rounded-lg flex justify-between items-center bg-slate-500 dark:bg-slate-700 text-white">
                        <div>
                            <p className="text-sm font-medium">Performance Packer</p>
                            <p className="text-2xl font-bold mt-1" id="performance-packer-percentage">0.00%</p>
                        </div>
                        <LineChart className="w-7 h-7 opacity-70" />
                    </div>
                    <div id="card-performance-shipped" className="p-4 rounded-lg flex justify-between items-center bg-slate-500 dark:bg-slate-700 text-white">
                        <div>
                            <p className="text-sm font-medium">Performance Dispatcher</p>
                            <p className="text-2xl font-bold mt-1" id="performance-shipped-percentage">0.00%</p>
                        </div>
                        <LineChart className="w-7 h-7 opacity-70" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average Pick / Hour</p>
                            <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100" id="average-pick-per-hour">0</p>
                        </div>
                        <BarChart className="w-7 h-7 text-purple-500 opacity-70" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average Pack / Hour</p>
                            <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100" id="average-pack-per-hour">0</p>
                        </div>
                        <Clock className="w-7 h-7 text-red-500 opacity-70" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Average Shipped / Hour</p>
                            <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-100" id="average-shipped-per-hour">0</p>
                        </div>
                        <Truck className="w-7 h-7 text-orange-500 opacity-70" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center cursor-pointer" data-collapsible-trigger="backlog-content">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Backlog Marketplace</h2>
                    <ChevronDown className="lucide-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ml-2" />
                </div>
                <div id="backlog-content" className="pt-6 hidden">
                    <div className="flex justify-end mb-4">
                        <div className="flex items-center gap-2">
                            {isEditingBacklog ? (
                                <>
                                    <Button onClick={handleAddBacklogRow} variant="outline" size="sm" className="flex items-center gap-1.5">
                                        <PlusCircle size={16} /> Add Row
                                    </Button>
                                    <Button onClick={handleSaveBacklog} size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5">
                                        Save
                                    </Button>
                                    <Button onClick={handleToggleEditBacklog} variant="destructive" size="sm" className="flex items-center gap-1.5">
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={handleToggleEditBacklog} size="sm" className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors shadow-sm">
                                        <Pencil size={16} /> <span className="hidden sm:inline">Edit</span>
                                    </Button>
                                    <Button onClick={() => (window as any).uploadBacklogCSV()} size="sm" className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                                        <Upload size={16} /> <span className="hidden sm:inline">Upload</span>
                                    </Button>
                                    <Button onClick={() => (window as any).exportBacklogCSV()} size="sm" className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
                                        <Download size={16} /> <span className="hidden sm:inline">Export</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Order</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marketplace</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                                    {isEditingBacklog && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>}
                                </tr>
                            </thead>
                            <tbody id="backlog-table-body" className="divide-y divide-gray-200 dark:divide-gray-700">
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mt-4">
                        <div className="flex items-center gap-2">
                            <span>Records per page:</span>
                            <select id="backlog-records-per-page" defaultValue={recordsPerPage} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-1">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="30">30</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4">
                            <span id="pagination-info">1-10 of 31</span>
                            <div className="flex items-center gap-1">
                                <button id="first-page-btn" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronsLeft size={20} />
                                </button>
                                <button id="prev-page-btn" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronLeft size={20} />
                                </button>
                                <button id="next-page-btn" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronRight size={20} />
                                </button>
                                <button id="last-page-btn" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronsRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mt-6">
                        <div className="flex justify-between items-center w-full mb-4">
                            <div className="flex items-center gap-2">
                                <h3 id="backlog-chart-title-main" className="text-lg font-medium text-gray-800 dark:text-gray-200">Grafik Backlog</h3>
                                <span id="backlog-chart-title-filter" className="text-lg font-medium text-gray-800 dark:text-gray-200">Store Name</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <select id="backlog-filter" className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded-md shadow-sm border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="platform">Store Name</option>
                                    <option value="source">Marketplace</option>
                                    <option value="marketplacePlatform">Platform</option>
                                </select>
                                <div className="text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div id="chart-data-count-new" className="flex justify-between items-center gap-8 px-4 py-2 cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <span>Marketplace Store</span>
                                        <span id="total-store-count" className="font-semibold">0</span>
                                    </div>
                                    <div id="chart-data-payment-new" className="flex justify-between items-center gap-8 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <span>Payment Accepted</span>
                                        <span id="total-payment-order" className="font-semibold">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-80 mt-4">
                            <canvas id="backlog-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            {[
                {id: 'pick', title: 'Summary Pick', color: '#ef4444'},
                {id: 'pack', title: 'Summary Pack', color: '#f59e0b'},
                {id: 'shipped', title: 'Summary Ship', color: '#8b5cf6'},
            ].map(sec => (
                <div key={sec.id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center gap-y-4 cursor-pointer" data-collapsible-trigger={`${sec.id}-content`}>
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{sec.title}</h2>
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                              <span className={`text-lg font-bold text-gray-800 dark:text-gray-100 total-${sec.id}-summary`}>0</span>
                            </div>
                        </div>
                        <ChevronDown className="lucide-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ml-2" />
                    </div>
                    <div id={`${sec.id}-content`} className="pt-6 hidden">
                       <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-between mb-6">
                           <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <label htmlFor={`${sec.id}-start-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">From:</label>
                                <input type="number" id={`${sec.id}-start-hour`} defaultValue="0" min="0" max="23" className="w-16 p-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md text-center" />
                                <label htmlFor={`${sec.id}-end-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">To:</label>
                                <input type="number" id={`${sec.id}-end-hour`} defaultValue="23" min="0" max="23" className="w-16 p-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md text-center" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft size={16}/></button>
                                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight size={16}/></button>
                            </div>
                             <div className="flex items-center gap-2">
                                <button onClick={() => (window as any).uploadCSV(sec.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow">
                                    <Upload size={16} /> <span className="hidden sm:inline">Upload</span>
                                </button>
                                <button onClick={() => (window as any).exportCSV(sec.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow">
                                    <Download size={16} /> <span className="hidden sm:inline">Export</span>
                                </button>
                            </div>
                        </div>
                         <div className="overflow-x-auto pb-2">
                            <div id={`${sec.id}-input-container`} className="space-y-4 min-w-[900px]"></div>
                        </div>
                        <div className="mt-8 relative h-96">
                             <canvas id={`${sec.id}-chart`}></canvas>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
      <style jsx>{`
        .toast {
            padding: 0.75rem 1.25rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: fadeInOut 4s forwards;
        }
        .toast.success { background-color: #10B981; }
        .toast.error { background-color: #EF4444; }
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .lucide-chevron-down {
            transition: transform 0.3s ease;
        }
        .rotate-180 {
            transform: rotate(180deg);
        }
      `}</style>
    </>
  );
}
