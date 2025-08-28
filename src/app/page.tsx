
"use client";
import { useEffect, useRef } from 'react';
import { ChevronDown, ShoppingCart, Sun, Moon, Boxes, PackageCheck, SendHorizonal, Coins, Hourglass, UserCheck, PackagePlus, Truck, LineChart, BarChart3, Clock, Upload, Download, Pencil, BarChart, User, Package, Settings, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function Home() {
  const chartInstances = useRef<{ [key: string]: Chart }>({});

  useEffect(() => {
    Chart.register(ChartDataLabels);

    let pickData: number[] = [];
    let packData: number[] = [];
    let shippedData: number[] = [];
    let backlogData: any[] = []; 
    let currentBacklogFilter = 'platform';
    let currentBacklogDataMode = 'count';

    const generateHours = () => {
        const hours = [];
        for (let i = 0; i <= 24; i++) {
            hours.push(`${String(i).padStart(2, '0')}:00`);
        }
        return hours;
    };
    
    const hours = generateHours();

    const initialBacklogData = [
      { platform: "Shopee", payment_order: "0", source: "Edit by Sociolla" },
      { platform: "Shopee Amuse", payment_order: "0", source: "Amuse Official Store" },
      { platform: "Shopee Ariul", payment_order: "0", source: "Ariul Official Store" },
      { platform: "Shopee COSRX", payment_order: "0", source: "COSRX Official Store" },
      { platform: "Shopee Derma Angel", payment_order: "0", source: "Derma Angel Official Store" },
      { platform: "Shopee Dr G", payment_order: "0", source: "Dr G Official Store" },
      { platform: "Shopee Espoir", payment_order: "0", source: "Espoir Official Store" },
      { platform: "Shopee Jung Saem Mool", payment_order: "0", source: "Jung Saem Mool Official Store" },
      { platform: "Shopee Lilla", payment_order: "0", source: "Lilla Official store" },
      { platform: "Shopee Lilla Baby", payment_order: "0", source: "Lilla Baby Indonesia" },
      { platform: "Shopee Mediheal", payment_order: "0", source: "Mediheal Official Store" },
      { platform: "Shopee Round Lab", payment_order: "0", source: "Round Lab Official Store" },
      { platform: "Shopee Speak to me", payment_order: "0", source: "Speak to me Official Store" },
      { platform: "Shopee Sukin", payment_order: "0", source: "Sukin Official Store" },
      { platform: "Shopee UB Mom", payment_order: "0", source: "UB Mom Indonesia" },
      { platform: "Shopee UIQ", payment_order: "0", source: "UIQ Official Store" },
      { platform: "tiktok_cosrx", payment_order: "0", source: "COSRX Official Store" },
      { platform: "tiktok_derma_angel", payment_order: "0", source: "Derma Angel Official Store" },
    ];

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
            data = pickData;
            filename = 'pick_data.csv';
            headers = ['Jam', 'Jumlah Order Picked'];
        } else if (type === 'pack') {
            data = packData;
            filename = 'pack_data.csv';
            headers = ['Jam', 'Jumlah Order Packed'];
        } else {
            data = shippedData;
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

                    if (type === 'pick') pickData = [...newData];
                    else if (type === 'pack') packData = [...newData];
                    else if (type === 'shipped') shippedData = [...newData];
                    
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
        const headers = ['Store Name', 'Payment Order', 'Marketplace Store'];
        let csvContent = headers.join(',') + '\n';
        backlogData.forEach(item => {
            csvContent += `"${item.platform}","${item.payment_order}","${item.source}"\n`;
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
                        if (parts.length >= 3) {
                            newBacklogData.push({
                                platform: parts[0].trim().replace(/"/g, ''),
                                payment_order: (parts[1].trim() && !isNaN(parseInt(parts[1].trim(), 10))) ? parts[1].trim() : "0", 
                                source: parts[2].trim().replace(/"/g, ''),
                            });
                        }
                    });
                    backlogData = [...newBacklogData];
                    updateDashboard();
                    document.getElementById('backlog-content')?.classList.remove('hidden');
                    showToast('Upload CSV Backlog berhasil!', 'success');
                } catch (error) {
                    showToast('Gagal memproses file CSV.', 'error');
                }
            };
            reader.readAsText(file);
        };
        fileInput.click();
    };

    (window as any).uploadCSV = uploadCSV;
    (window as any).exportCSV = exportCSV;
    (window as any).uploadBacklogCSV = uploadBacklogCSV;
    (window as any).exportBacklogCSV = exportBacklogCSV;

    const updateSummary = () => {
        const totalPickOrder = pickData.reduce((a, b) => a + b, 0);
        const totalPackOrder = packData.reduce((a, b) => a + b, 0);
        const totalShippedOrder = shippedData.reduce((a, b) => a + b, 0);
        const paymentOrders = backlogData.reduce((sum, item) => sum + (parseInt(item.payment_order, 10) || 0), 0);
        const pickerCount = parseInt((document.getElementById('picker-input') as HTMLInputElement).value, 10) || 0;
        const packerCount = parseInt((document.getElementById('packer-input') as HTMLInputElement).value, 10) || 0;
        const dispatcherCount = parseInt((document.getElementById('dispatcher-input') as HTMLInputElement).value, 10) || 0;

        const nonZeroPick = pickData.filter(v => v > 0).length || 1;
        const nonZeroPack = packData.filter(v => v > 0).length || 1;
        const nonZeroShipped = shippedData.filter(v => v > 0).length || 1;
        
        const inProgressOrders = totalPickOrder - totalPackOrder;
        
        const targetPick = 650;
        const targetPack = 525;
        const targetShipped = 515;

        const performancePicker = pickerCount > 0 ? Math.min(100, ((totalPickOrder / pickerCount) / targetPick) * 100) : 0;
        const performancePacker = packerCount > 0 ? Math.min(100, ((totalPackOrder / packerCount) / targetPack) * 100) : 0;
        const performanceShipped = dispatcherCount > 0 ? Math.min(100, ((totalShippedOrder / dispatcherCount) / targetShipped) * 100) : 0;

        const setText = (id: string, value: string | number) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value.toLocaleString();
        }

        setText('total-pick-order', totalPickOrder);
        setText('total-packed-orders', totalPackOrder);
        setText('total-shipped-orders', totalShippedOrder);
        setText('payment-accepted-count', paymentOrders);
        setText('in-progress-orders', inProgressOrders);
        
        setText('jumlah-picker-value', pickerCount);
        setText('jumlah-packer-value', packerCount);
        setText('jumlah-dispatcher-value', dispatcherCount);
        
        setText('average-pick-per-hour', Math.round(totalPickOrder / nonZeroPick));
        setText('average-pack-per-hour', Math.round(totalPackOrder / nonZeroPack));
        setText('average-shipped-per-hour', Math.round(totalShippedOrder / nonZeroShipped));
        
        setText('performance-picker-percentage', `${performancePicker.toFixed(2)}%`);
        setText('performance-packer-percentage', `${performancePacker.toFixed(2)}%`);
        setText('performance-shipped-percentage', `${performanceShipped.toFixed(2)}%`);

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

    const renderChart = (canvasId: string, chartType: 'bar' | 'line', labels: string[], data: number[], label: string, color: string) => {
        const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!ctx) return;

        if (chartInstances.current[canvasId]) {
            chartInstances.current[canvasId].destroy();
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
                    borderRadius: chartType === 'bar' ? 5 : undefined,
                    borderWidth: 1,
                    tension: 0.4,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { color: document.body.classList.contains('dark') ? '#374151' : '#E5E7EB' } }
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value > 0 ? value : null,
                        color: document.body.classList.contains('dark') ? '#e5e7eb' : '#374151',
                        font: { weight: 'bold' }
                    }
                }
            }
        });
    };
    
    const renderAllCharts = () => {
        const startPickHour = parseInt((document.getElementById('pick-start-hour') as HTMLInputElement).value, 10);
        const endPickHour = parseInt((document.getElementById('pick-end-hour') as HTMLInputElement).value, 10);
        const filteredPickHours = hours.slice(startPickHour, endPickHour + 1);
        const filteredPickData = pickData.slice(startPickHour, endPickHour + 1);
        renderChart('pick-chart', 'bar', filteredPickHours, filteredPickData, 'Total Picked', '#ef4444');

        const startPackHour = parseInt((document.getElementById('pack-start-hour') as HTMLInputElement).value, 10);
        const endPackHour = parseInt((document.getElementById('pack-end-hour') as HTMLInputElement).value, 10);
        const filteredPackHours = hours.slice(startPackHour, endPackHour + 1);
        const filteredPackData = packData.slice(startPackHour, endPackHour + 1);
        renderChart('pack-chart', 'bar', filteredPackHours, filteredPackData, 'Total Packed', '#f59e0b');
        
        const startShippedHour = parseInt((document.getElementById('shipped-start-hour') as HTMLInputElement).value, 10);
        const endShippedHour = parseInt((document.getElementById('shipped-end-hour') as HTMLInputElement).value, 10);
        const filteredShippedHours = hours.slice(startShippedHour, endShippedHour + 1);
        const filteredShippedData = shippedData.slice(startShippedHour, endShippedHour + 1);
        renderChart('shipped-chart', 'bar', filteredShippedHours, filteredShippedData, 'Total Shipped', '#10b981');

        // Backlog Chart
        const dataToFilter = currentBacklogFilter === 'platform' ? 'platform' : 'source';
        const groupedData = backlogData.reduce((acc, item) => {
            const key = item[dataToFilter];
            const normalizedKey = key.toLowerCase().startsWith('shopee') ? 'Shopee' : (key.toLowerCase().startsWith('tiktok') ? 'Tiktok' : key);
            
            if (currentBacklogDataMode === 'count') {
                acc[normalizedKey] = (acc[normalizedKey] || 0) + 1;
            } else {
                acc[normalizedKey] = (acc[normalizedKey] || 0) + (parseInt(item.payment_order, 10) || 0);
            }
            return acc;
        }, {});
        
        const backlogLabels = Object.keys(groupedData);
        const backlogValues = Object.values(groupedData) as number[];
        const chartLabel = currentBacklogDataMode === 'count' ? 'Count of Stores' : 'Total Payment Orders';
        document.getElementById('backlog-chart-title')!.innerText = `Grafik Backlog per ${currentBacklogFilter === 'platform' ? 'Store Name' : 'Marketplace'}`;
        renderChart('backlog-chart', 'bar', backlogLabels, backlogValues, chartLabel, '#34d399');
    };

    const updateDashboard = () => {
        updateInputFieldsValues();
        updateSummary();
        renderBacklogTable();
        renderAllCharts();
    };

    const createInputFields = () => {
        const create = (containerId: string, className: string, dataType: 'pick' | 'pack' | 'shipped') => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';
            hours.slice(0, 24).forEach((hour, index) => { // Only 00:00 to 23:00
                const div = document.createElement('div');
                div.className = 'flex-none w-24 text-center';
                div.innerHTML = `
                    <label class="block text-sm text-gray-500 dark:text-gray-400">${hour}</label>
                    <input type="number" data-index="${index}" class="${className} mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center" value="0" min="0">
                `;
                container.appendChild(div);
            });
            container.querySelectorAll(`.${className}`).forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt((e.target as HTMLInputElement).dataset.index!, 10);
                    const value = parseInt((e.target as HTMLInputElement).value, 10) || 0;
                    if (dataType === 'pick') pickData[index] = value;
                    else if (dataType === 'pack') packData[index] = value;
                    else if (dataType === 'shipped') shippedData[index] = value;
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
        update('pick-input', pickData);
        update('pack-input', packData);
        update('shipped-input', shippedData);
    };
    
    const renderBacklogTable = () => {
        const tableBody = document.getElementById('backlog-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        backlogData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'dark:border-gray-700';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.platform}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${parseInt(item.payment_order, 10).toLocaleString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.source}</td>
            `;
            tableBody.appendChild(row);
        });
    };
    
    const setupCollapsible = () => {
        document.querySelectorAll('[data-collapsible-trigger]').forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                // Ignore clicks on interactive elements within the header
                if (target.closest('button, a, input, select')) {
                    return;
                }

                const contentId = trigger.getAttribute('data-collapsible-trigger');
                const content = document.getElementById(contentId!);
                const icon = trigger.querySelector('.lucide-chevron-down');

                if (content && icon) {
                    const isHidden = content.classList.contains('hidden');
                    content.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180', !isHidden);
                }
            });
        });
    };

    const setupEventListeners = () => {
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
            updateDashboard();
        });

        ['picker-input', 'packer-input', 'dispatcher-input', 
         'pick-start-hour', 'pick-end-hour', 'pack-start-hour', 'pack-end-hour', 
         'shipped-start-hour', 'shipped-end-hour'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', updateDashboard);
            }
        });

        const setupFilterButton = (buttonId: string, filterType: 'platform' | 'source', otherButtonId: string) => {
            document.getElementById(buttonId)?.addEventListener('click', () => {
                currentBacklogFilter = filterType;
                updateDashboard();
                document.getElementById(buttonId)?.classList.replace('bg-gray-200', 'bg-indigo-600');
                document.getElementById(buttonId)?.classList.replace('dark:bg-gray-700', 'dark:bg-indigo-500');
                document.getElementById(buttonId)?.classList.add('text-white');
                document.getElementById(otherButtonId)?.classList.replace('bg-indigo-600', 'bg-gray-200');
                document.getElementById(otherButtonId)?.classList.replace('dark:bg-indigo-500', 'dark:bg-gray-700');
                document.getElementById(otherButtonId)?.classList.remove('text-white');
            });
        };
        setupFilterButton('filter-platform', 'platform', 'filter-source');
        setupFilterButton('filter-source', 'source', 'filter-platform');

        const setupDataModeButton = (buttonId: string, dataMode: 'count' | 'payment', otherButtonId: string) => {
            document.getElementById(buttonId)?.addEventListener('click', () => {
                currentBacklogDataMode = dataMode;
                updateDashboard();
                document.getElementById(buttonId)?.classList.replace('bg-gray-200', 'bg-indigo-600');
                document.getElementById(buttonId)?.classList.replace('dark:bg-gray-700', 'dark:bg-indigo-500');
                document.getElementById(buttonId)?.classList.add('text-white');
                document.getElementById(otherButtonId)?.classList.replace('bg-indigo-600', 'bg-gray-200');
                document.getElementById(otherButtonId)?.classList.replace('dark:bg-indigo-500', 'dark:bg-gray-700');
                document.getElementById(otherButtonId)?.classList.remove('text-white');
            });
        };
        setupDataModeButton('chart-data-count', 'count', 'chart-data-payment');
        setupDataModeButton('chart-data-payment', 'payment', 'chart-data-count');
    };

    // Initial setup
    const init = () => {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
        pickData = Array(hours.length).fill(0);
        packData = Array(hours.length).fill(0);
        shippedData = Array(hours.length).fill(0);
        backlogData = [...initialBacklogData];

        createInputFields();
        setupCollapsible();
        setupEventListeners();
        updateDashboard();
    };

    init();

    return () => {
      // Cleanup charts on component unmount
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };

  }, []);

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
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
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
                <div className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between">
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
                        <Coins className="w-8 h-8 text-amber-500 opacity-70" />
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
                <div id="performance-content" className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Row 1 */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jumlah Picker</p>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="number" id="picker-input" defaultValue="0" className="w-full p-1 border-none dark:bg-gray-700 rounded-md text-left bg-transparent focus:outline-none text-2xl font-bold text-gray-800 dark:text-gray-100" min="0" />
                             <span id="jumlah-picker-value" className="hidden">0</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jumlah Packer</p>
                             <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                             <input type="number" id="packer-input" defaultValue="0" className="w-full p-1 border-none dark:bg-gray-700 rounded-md text-left bg-transparent focus:outline-none text-2xl font-bold text-gray-800 dark:text-gray-100" min="0" />
                             <span id="jumlah-packer-value" className="hidden">0</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jumlah Dispatcher</p>
                             <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                         <div className="flex items-center gap-2 mt-1">
                            <input type="number" id="dispatcher-input" defaultValue="0" className="w-full p-1 border-none dark:bg-gray-700 rounded-md text-left bg-transparent focus:outline-none text-2xl font-bold text-gray-800 dark:text-gray-100" min="0" />
                            <span id="jumlah-dispatcher-value" className="hidden">0</span>
                        </div>
                    </div>

                    {/* Row 2 */}
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

                    {/* Row 3 */}
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
                     <div className="flex items-center gap-2">
                        <button onClick={() => (window as any).uploadBacklogCSV()} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
                            <Upload size={16} /> <span className="hidden sm:inline">Upload</span>
                        </button>
                        <button onClick={() => (window as any).exportBacklogCSV()} className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
                            <Download size={16} /> <span className="hidden sm:inline">Export</span>
                        </button>
                        <ChevronDown className="lucide-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ml-2" />
                    </div>
                </div>
                <div id="backlog-content" className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                    <div className="lg:col-span-3 overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Order</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marketplace</th>
                                </tr>
                            </thead>
                            <tbody id="backlog-table-body" className="divide-y divide-gray-200 dark:divide-gray-700">
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <h3 id="backlog-chart-title" className="text-lg font-medium text-gray-800 dark:text-gray-200">Grafik Backlog</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <div className="flex rounded-md shadow-sm">
                               <button id="filter-platform" className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-l-md hover:bg-indigo-700 transition-colors">Store</button>
                               <button id="filter-source" className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Marketplace</button>
                            </div>
                             <div className="flex rounded-md shadow-sm">
                               <button id="chart-data-count" className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-l-md hover:bg-indigo-700 transition-colors">Count</button>
                               <button id="chart-data-payment" className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Payment</button>
                            </div>
                        </div>
                        <div className="h-80 mt-4">
                            <canvas id="backlog-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            {[
                {id: 'pick', title: 'Summary Pick', color: 'indigo'},
                {id: 'pack', title: 'Summary Pack', color: 'yellow'},
                {id: 'shipped', title: 'Summary Ship', color: 'emerald'},
            ].map(sec => (
                <div key={sec.id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center cursor-pointer" data-collapsible-trigger={`${sec.id}-content`}>
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{sec.title}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                            <span className={`text-sm font-bold text-gray-800 dark:text-gray-100 total-${sec.id}-summary`}>0</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                <label htmlFor={`${sec.id}-start-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">From:</label>
                                <input type="number" id={`${sec.id}-start-hour`} defaultValue="0" min="0" max="24" className="w-16 p-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md text-center" />
                                <label htmlFor={`${sec.id}-end-hour`} className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">To:</label>
                                <input type="number" id={`${sec.id}-end-hour`} defaultValue="24" min="0" max="24" className="w-16 p-1 border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-md text-center" />
                            </div>
                            <button onClick={() => (window as any).uploadCSV(sec.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow">
                                <Upload size={16} /> <span className="hidden sm:inline">Upload</span>
                            </button>
                            <button onClick={() => (window as any).exportCSV(sec.id)} className="flex items-center gap-1.5 text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow">
                                <Download size={16} /> <span className="hidden sm:inline">Export</span>
                            </button>
                            <ChevronDown className="lucide-chevron-down text-gray-500 dark:text-gray-400 transition-transform duration-300 ml-2" />
                        </div>
                    </div>
                    <div id={`${sec.id}-content`} className="hidden">
                        <div className="overflow-x-auto pb-4 mt-6 -mx-4 px-4">
                            <div id={`${sec.id}-input-container`} className="grid grid-cols-12 gap-4"></div>
                        </div>
                        <div className="mt-8 h-80">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Grafik Total {sec.title.split(' ')[1]}</h3>
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
        #picker-input, #packer-input, #dispatcher-input {
            -moz-appearance: textfield;
        }
        #picker-input::-webkit-outer-spin-button,
        #picker-input::-webkit-inner-spin-button,
        #packer-input::-webkit-outer-spin-button,
        #packer-input::-webkit-inner-spin-button,
        #dispatcher-input::-webkit-outer-spin-button,
        #dispatcher-input::-webkit-inner-spin-button {
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
