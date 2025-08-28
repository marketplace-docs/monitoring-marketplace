
"use client"
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    
    // Inisialisasi state awal
    let pickData: number[] = [];
    let packData: number[] = [];
    let shippedData: number[] = [];
    let originalPickData: number[] = [];
    let originalPackData: number[] = [];
    let originalShippedData: number[] = [];
    let backlogData: any[] = []; 
    let currentBacklogFilter = 'platform'; 
    let currentBacklogDataMode = 'count'; 
    let summary: any = {};
    let pickChartInstance: any;
    let packChartInstance: any;
    let shippedChartInstance: any;
    let backlogChartInstance: any; 

    const generateHours = () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(`${i}:00`);
        }
        hours.push('24:00');
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
        if (!toastContainer) {
            console.error('Toast container not found.');
            return;
        }
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
            data = originalPickData;
            filename = 'pick_data.csv';
            headers = ['Jam', 'Jumlah Order Picked'];
        } else if (type === 'pack') {
            data = originalPackData;
            filename = 'pack_data.csv';
            headers = ['Jam', 'Jumlah Order Packed'];
        } else {
            data = originalShippedData;
            filename = 'shipped_data.csv';
            headers = ['Jam', 'Jumlah Order Shipped'];
        }

        let csvContent = headers.join(',') + '\n';
        hours.forEach((hour, index) => {
            csvContent += `${hour},${data[index]}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    (window as any).exportCSV = exportCSV;

    const uploadCSV = (type: 'pick' | 'pack' | 'shipped') => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (!file) {
                showToast('Upload dibatalkan', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event: any) {
                try {
                    const csvData = event.target.result;
                    const lines = csvData.split('\n');
                    const newData = Array(hours.length).fill(0);
                    
                    lines.slice(1).forEach((line: string) => {
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

                    if (type === 'pick') {
                        originalPickData = [...newData];
                        pickData = [...originalPickData];
                        updateInputFieldsValues('pick', pickData);
                    } else if (type === 'pack') {
                        originalPackData = [...newData];
                        packData = [...originalPackData];
                        updateInputFieldsValues('pack', packData);
                    } else if (type === 'shipped') {
                        originalShippedData = [...newData];
                        shippedData = [...originalShippedData];
                        updateInputFieldsValues('shipped', shippedData);
                    }
                    updateDashboard();
                    showToast('Upload CSV berhasil!', 'success');
                } catch (error) {
                    showToast('Gagal memproses file CSV.', 'error');
                    console.error('Error processing CSV:', error);
                }
            };
            reader.onerror = function() {
                showToast('Gagal membaca file.', 'error');
            };
            reader.readAsText(file);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };
    (window as any).uploadCSV = uploadCSV;


    const exportBacklogCSV = () => {
        const filename = 'backlog_data.csv';
        const headers = ['Store Name', 'Payment Order', 'Marketplace Store'];
        let csvContent = headers.join(',') + '\n';
        backlogData.forEach(item => {
            csvContent += `${item.platform},${item.payment_order},${item.source}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    (window as any).exportBacklogCSV = exportBacklogCSV;

    const uploadBacklogCSV = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (!file) {
                showToast('Upload dibatalkan', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event: any) {
                try {
                    const csvData = event.target.result;
                    const lines = csvData.split('\n');
                    const newBacklogData: any[] = [];
                    
                    lines.slice(1).forEach((line: string) => {
                        const parts = line.split(',');
                        if (parts.length >= 3) { 
                            newBacklogData.push({
                                platform: parts[0].trim(),
                                payment_order: (parts[1].trim() && !isNaN(parseInt(parts[1].trim(), 10))) ? parts[1].trim() : "0", 
                                source: parts[2].trim()
                            });
                        }
                    });
                    backlogData = [...newBacklogData];
                    updateDashboard();
                    document.getElementById('backlog-content')?.classList.remove('hidden');
                    showToast('Upload CSV Backlog berhasil!', 'success');
                } catch (error) {
                    showToast('Gagal memproses file CSV.', 'error');
                    console.error('Error processing CSV:', error);
                }
            };
            reader.onerror = function() {
                showToast('Gagal membaca file.', 'error');
            };
            reader.readAsText(file);
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    };
    (window as any).uploadBacklogCSV = uploadBacklogCSV;
    
    const updateInputFieldsValues = (type: 'pick' | 'pack' | 'shipped', data: number[]) => {
        let containerId: string;
        if (type === 'pick') {
            containerId = 'pick-input-container';
        } else if (type === 'pack') {
            containerId = 'pack-input-container';
        } else {
            containerId = 'shipped-input-container';
        }

        const container = document.getElementById(containerId);
        if (container) {
            const inputs = container.querySelectorAll('input');
            inputs.forEach((input, index) => {
                (input as HTMLInputElement).value = (data[index] || 0).toString();
            });
        }
    };

    const updateSummary = () => {
        const totalPickOrder = pickData.reduce((sum, value) => sum + (value || 0), 0);
        const totalPackOrder = packData.reduce((sum, value) => sum + (value || 0), 0);
        const totalShippedOrder = shippedData.reduce((sum, value) => sum + (value || 0), 0);
        const paymentOrders = backlogData.reduce((sum, item) => sum + (parseInt(item.payment_order, 10) || 0), 0);
        const pickerCount = parseInt((document.getElementById('picker-input') as HTMLInputElement)?.value, 10) || 0;
        const packerCount = parseInt((document.getElementById('packer-input') as HTMLInputElement)?.value, 10) || 0;
        const dispatcherCount = parseInt((document.getElementById('dispatcher-input') as HTMLInputElement)?.value, 10) || 0;

        const nonZeroPickValues = pickData.filter(v => v > 0);
        const nonZeroPackValues = packData.filter(v => v > 0);
        const nonZeroShippedValues = shippedData.filter(v => v > 0);

        const averagePickPerHour = nonZeroPickValues.length > 0
            ? Math.round(totalPickOrder / nonZeroPickValues.length)
            : '0';
        
        const averagePackPerHour = nonZeroPackValues.length > 0
            ? Math.round(totalPackOrder / nonZeroPackValues.length)
            : '0';
        
        const averageShippedPerHour = nonZeroShippedValues.length > 0
            ? Math.round(totalShippedOrder / nonZeroShippedValues.length)
            : '0';

        const inProgressOrders = totalPickOrder - totalPackOrder;
        
        const targetPick = 650;
        const targetPack = 525;
        const targetShipped = 515;
        
        const performancePicker = (pickerCount > 0) ? Math.min(((totalPickOrder / pickerCount) / targetPick) * 100, 100) : 0;
        const performancePacker = (packerCount > 0) ? Math.min(((totalPackOrder / packerCount) / targetPack) * 100, 100) : 0;
        const performanceShipped = (dispatcherCount > 0) ? Math.min(((totalShippedOrder / dispatcherCount) / targetShipped) * 100, 100) : 0;
        
        summary = {
            totalPickOrder,
            totalPacked: totalPackOrder,
            totalShipped: totalShippedOrder,
            payment: paymentOrders,
            inProgress: inProgressOrders,
            averagePickPerHour,
            averagePackPerHour,
            averageShippedPerHour,
            pickerCount,
            packerCount,
            dispatcherCount,
            performancePicker: performancePicker.toFixed(2),
            performancePacker: performancePacker.toFixed(2),
            performanceShipped: performanceShipped.toFixed(2),
        };

        const setInnerText = (id: string, text: string) => {
          const el = document.getElementById(id);
          if (el) el.innerText = text;
        }

        setInnerText('total-pick-order', summary.totalPickOrder.toString());
        setInnerText('total-packed-orders', summary.totalPacked.toString());
        setInnerText('total-shipped-orders', summary.totalShipped.toString());
        setInnerText('payment-accepted-count', summary.payment.toString());
        setInnerText('in-progress-orders', summary.inProgress.toString());
        setInnerText('performance-picker-percentage', `${summary.performancePicker}%`);
        setInnerText('performance-packer-percentage', `${summary.performancePacker}%`);
        setInnerText('performance-shipped-percentage', `${summary.performanceShipped}%`);
        setInnerText('average-pick-per-hour', `${summary.averagePickPerHour}`);
        setInnerText('average-pack-per-hour', `${summary.averagePackPerHour}`);
        setInnerText('average-shipped-per-hour', `${summary.averageShippedPerHour}`);
        
        const updatePerformanceColor = (elementId: string, percentage: number) => {
            const card = document.getElementById(elementId);
            if (card) {
                card.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-gray-400');
                if (percentage === 0) {
                    card.classList.add('bg-gray-400');
                } else if (percentage >= 100) {
                    card.classList.add('bg-green-500');
                } else if (percentage >= 90) {
                    card.classList.add('bg-yellow-500');
                } else {
                    card.classList.add('bg-red-500');
                }
            }
        };

        updatePerformanceColor('card-performance-picker', parseFloat(summary.performancePicker));
        updatePerformanceColor('card-performance-packer', parseFloat(summary.performancePacker));
        updatePerformanceColor('card-performance-shipped', parseFloat(summary.performanceShipped));
    };

    const renderCharts = async () => {
        const Chart = (await import('chart.js/auto')).default;
        const ChartDataLabels = (await import('chartjs-plugin-datalabels')).default;
        Chart.register(ChartDataLabels);

        const pickContent = document.getElementById('pick-content');
        let startPickHour = 0;
        let endPickHour = 24;

        if (pickContent && !pickContent.classList.contains('hidden')) {
            startPickHour = parseInt((document.getElementById('pick-start-hour') as HTMLInputElement)?.value, 10);
            endPickHour = parseInt((document.getElementById('pick-end-hour') as HTMLInputElement)?.value, 10);
        }
        
        const filteredPickHours = hours.slice(startPickHour, endPickHour + 1);
        const filteredPickData = originalPickData.slice(startPickHour, endPickHour + 1);
        
        if (pickChartInstance) pickChartInstance.destroy();
        const pickChartEl = document.getElementById('pick-chart') as HTMLCanvasElement;
        if(pickChartEl) {
            pickChartInstance = new Chart(pickChartEl, {
                type: 'bar',
                data: {
                    labels: filteredPickHours,
                    datasets: [{
                        label: 'Jumlah Order Picked',
                        data: filteredPickData,
                        backgroundColor: '#8884d8',
                        borderRadius: 10,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value > 0 ? value : '',
                            color: '#4A5568',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        }
        
        const packContent = document.getElementById('pack-content');
        let startPackHour = 0;
        let endPackHour = 24;

        if (packContent && !packContent.classList.contains('hidden')) {
            startPackHour = parseInt((document.getElementById('pack-start-hour') as HTMLInputElement)?.value, 10);
            endPackHour = parseInt((document.getElementById('pack-end-hour') as HTMLInputElement)?.value, 10);
        }

        const filteredPackHours = hours.slice(startPackHour, endPackHour + 1);
        const filteredPackData = originalPackData.slice(startPackHour, endPackHour + 1);
        
        if (packChartInstance) packChartInstance.destroy();
        const packChartEl = document.getElementById('pack-chart') as HTMLCanvasElement;
        if (packChartEl) {
            packChartInstance = new Chart(packChartEl, {
                type: 'bar',
                data: {
                    labels: filteredPackHours,
                    datasets: [{
                        label: 'Jumlah Order Packed',
                        data: filteredPackData,
                        backgroundColor: '#3b82f6',
                        borderRadius: 10,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value > 0 ? value : '',
                            color: '#4A5568',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        }

        const shippedContent = document.getElementById('shipped-content');
        let startShippedHour = 0;
        let endShippedHour = 24;

        if (shippedContent && !shippedContent.classList.contains('hidden')) {
            startShippedHour = parseInt((document.getElementById('shipped-start-hour') as HTMLInputElement)?.value, 10);
            endShippedHour = parseInt((document.getElementById('shipped-end-hour') as HTMLInputElement)?.value, 10);
        }
        
        const filteredShippedHours = hours.slice(startShippedHour, endShippedHour + 1);
        const filteredShippedData = originalShippedData.slice(startShippedHour, endShippedHour + 1);
        
        if (shippedChartInstance) shippedChartInstance.destroy();
        const shippedChartEl = document.getElementById('shipped-chart') as HTMLCanvasElement;
        if(shippedChartEl) {
            shippedChartInstance = new Chart(shippedChartEl, {
                type: 'bar',
                data: {
                    labels: filteredShippedHours,
                    datasets: [{
                        label: 'Jumlah Order Shipped',
                        data: filteredShippedData,
                        backgroundColor: '#10b981',
                        borderRadius: 10,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value > 0 ? value : '',
                            color: '#4A5568',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        }

        const backlogChartTitle = document.getElementById('backlog-chart-title');
        let backlogLabels: string[] = [];
        let backlogValues: number[] = [];
        let chartLabel = '';
        
        const dataToFilter = currentBacklogFilter === 'platform' ? 'platform' : 'source';
        const groupedData: {[key: string]: number} = {};

        if (currentBacklogDataMode === 'count') {
            backlogData.forEach(item => {
                const key = item[dataToFilter];
                const normalizedKey = key.toLowerCase().startsWith('shopee') || key.toLowerCase().startsWith('shoope') ? 'Shopee' : key.split(' ')[0];
                groupedData[normalizedKey] = (groupedData[normalizedKey] || 0) + 1;
            });
            backlogLabels = Object.keys(groupedData);
            backlogValues = Object.values(groupedData);
            chartLabel = 'Count of Store';
            if(backlogChartTitle) backlogChartTitle.innerText = 'Grafik Backlog per Store Name';
        } else if (currentBacklogDataMode === 'payment') {
            backlogData.forEach(item => {
                const key = item[dataToFilter];
                const normalizedKey = key.toLowerCase().startsWith('shopee') || key.toLowerCase().startsWith('shoope') ? 'Shopee' : key.split(' ')[0];
                groupedData[normalizedKey] = (groupedData[normalizedKey] || 0) + (parseInt(item.payment_order, 10) || 0);
            });
            backlogLabels = Object.keys(groupedData);
            backlogValues = Object.values(groupedData);
            chartLabel = 'Total Payment Orders';
            if(backlogChartTitle) backlogChartTitle.innerText = 'Grafik Payment Order per Store Name';
        }
        
        if (backlogChartInstance) backlogChartInstance.destroy();
        const backlogChartEl = document.getElementById('backlog-chart') as HTMLCanvasElement;
        if (backlogChartEl) {
            backlogChartInstance = new Chart(backlogChartEl, {
                type: 'bar',
                data: {
                    labels: backlogLabels,
                    datasets: [{
                        label: chartLabel,
                        data: backlogValues,
                        backgroundColor: [
                            '#8884d8', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#60a5fa', '#34d399', '#7f1d1d', '#5b21b6', '#065f46', '#e11d48'
                        ],
                        borderRadius: 10,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            formatter: (value) => value > 0 ? value : '',
                            color: '#4A5568',
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        }
    };

    const updateDashboard = () => {
        updateSummary();
        renderBacklogTable();
        renderCharts();
    };

    const createInputFields = () => {
        const pickInputContainer = document.getElementById('pick-input-container');
        const packInputContainer = document.getElementById('pack-input-container');
        const shippedInputContainer = document.getElementById('shipped-input-container');

        if (pickInputContainer) {
          hours.forEach((hour, index) => {
              const pickInputDiv = document.createElement('div');
              pickInputDiv.className = 'flex-none w-24 text-center';
              pickInputDiv.innerHTML = `
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-500">${hour}</label>
                  <input type="number" data-index="${index}" class="pick-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center" value="0" min="0">
              `;
              pickInputContainer.appendChild(pickInputDiv);
          });
        }
        if (packInputContainer) {
          hours.forEach((hour, index) => {
              const packInputDiv = document.createElement('div');
              packInputDiv.className = 'flex-none w-24 text-center';
              packInputDiv.innerHTML = `
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-500">${hour}</label>
                  <input type="number" data-index="${index}" class="pack-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center" value="0" min="0">
              `;
              packInputContainer.appendChild(packInputDiv);
          });
        }
        if (shippedInputContainer) {
          hours.forEach((hour, index) => {
              const shippedInputDiv = document.createElement('div');
              shippedInputDiv.className = 'flex-none w-24 text-center';
              shippedInputDiv.innerHTML = `
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-500">${hour}</label>
                  <input type="number" data-index="${index}" class="shipped-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center" value="0" min="0">
              `;
              shippedInputContainer.appendChild(shippedInputDiv);
          });
        }
        
        const handleInput = (e: any, type: 'pick' | 'pack' | 'shipped') => {
          const index = parseInt(e.target.dataset.index);
          const value = parseInt(e.target.value, 10) || 0;
          if (type === 'pick') {
            originalPickData[index] = value;
            pickData = [...originalPickData];
          } else if (type === 'pack') {
            originalPackData[index] = value;
            packData = [...originalPackData];
          } else {
            originalShippedData[index] = value;
            shippedData = [...originalShippedData];
          }
          updateDashboard();
        }

        if (pickInputContainer) {
            pickInputContainer.querySelectorAll('.pick-input').forEach(input => {
                input.addEventListener('input', (e) => handleInput(e, 'pick'));
            });
        }
        if (packInputContainer) {
            packInputContainer.querySelectorAll('.pack-input').forEach(input => {
                input.addEventListener('input', (e) => handleInput(e, 'pack'));
            });
        }
        if (shippedInputContainer) {
            shippedInputContainer.querySelectorAll('.shipped-input').forEach(input => {
                input.addEventListener('input', (e) => handleInput(e, 'shipped'));
            });
        }
    };
    
    const renderBacklogTable = () => {
        const tableBody = document.getElementById('backlog-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = ''; 
        backlogData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.platform}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.payment_order}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.source}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    }

    originalPickData = hours.map(() => 0);
    originalPackData = hours.map(() => 0);
    originalShippedData = hours.map(() => 0);
    pickData = [...originalPickData];
    packData = [...originalPackData];
    shippedData = [...originalShippedData];
    
    backlogData = [...initialBacklogData];
    
    createInputFields();
    updateDashboard();
    
    document.getElementById('picker-input')?.addEventListener('input', updateSummary);
    document.getElementById('packer-input')?.addEventListener('input', updateSummary);
    document.getElementById('dispatcher-input')?.addEventListener('input', updateSummary);
    
    const setupCollapsible = (headerId: string, contentId: string, iconClass: string) => {
      const header = document.getElementById(headerId);
      const icon = header?.querySelector(`.${iconClass}`);
      const content = document.getElementById(contentId);
      header?.addEventListener('click', () => {
          const isHidden = content?.classList.toggle('hidden');
          if (isHidden) {
              icon?.classList.add('rotate-180');
          } else {
              icon?.classList.remove('rotate-180');
          }
      });
    }

    setupCollapsible('pick-header', 'pick-content', 'pick-header-icon');
    setupCollapsible('pack-header', 'pack-content', 'pack-header-icon');
    setupCollapsible('shipped-header', 'shipped-content', 'shipped-header-icon');
    setupCollapsible('backlog-header', 'backlog-content', 'backlog-header-icon');
    setupCollapsible('performance-header', 'performance-content', 'performance-header-icon');

    document.getElementById('pick-start-hour')?.addEventListener('input', updateDashboard);
    document.getElementById('pick-end-hour')?.addEventListener('input', updateDashboard);
    document.getElementById('pack-start-hour')?.addEventListener('input', updateDashboard);
    document.getElementById('pack-end-hour')?.addEventListener('input', updateDashboard);
    document.getElementById('shipped-start-hour')?.addEventListener('input', updateDashboard);
    document.getElementById('shipped-end-hour')?.addEventListener('input', updateDashboard);

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('dark');
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });

    const setupFilterButton = (buttonId: string, filterType: string, otherButtonId: string) => {
      const button = document.getElementById(buttonId);
      button?.addEventListener('click', () => {
        currentBacklogFilter = filterType;
        updateDashboard();
        button.classList.add('bg-indigo-500', 'text-white');
        button.classList.remove('bg-gray-300', 'text-gray-800');
        const otherButton = document.getElementById(otherButtonId);
        otherButton?.classList.add('bg-gray-300', 'text-gray-800');
        otherButton?.classList.remove('bg-indigo-500', 'text-white');
      });
    }
    setupFilterButton('filter-platform', 'platform', 'filter-source');
    setupFilterButton('filter-source', 'source', 'filter-platform');

    const setupDataModeButton = (buttonId: string, dataMode: string, otherButtonId: string) => {
      const button = document.getElementById(buttonId);
      button?.addEventListener('click', () => {
        currentBacklogDataMode = dataMode;
        updateDashboard();
        button.classList.add('bg-indigo-500', 'text-white');
        button.classList.remove('bg-gray-300', 'text-gray-800');
        const otherButton = document.getElementById(otherButtonId);
        otherButton?.classList.add('bg-gray-300', 'text-gray-800');
        otherButton?.classList.remove('bg-indigo-500', 'text-white');
      });
    }
    setupDataModeButton('chart-data-count', 'count', 'chart-data-payment');
    setupDataModeButton('chart-data-payment', 'payment', 'chart-data-count');


  }, []);

  return (
    <>
    <div className="flex">
        <div id="app" className="w-full space-y-8 max-w-full mx-auto">
            
            <header className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg transition-colors duration-300">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart text-indigo-600"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.67 12.01h12.58l3.1-6H5.97"/></svg>
                        Market Place Dashboard
                    </h1>
                </div>
                <button id="theme-toggle" className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon dark:text-yellow-400 text-gray-800"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>
            </header>

            <div className="px-6">
                <p className="text-sm font-medium text-gray-500">From payment to progress — only cleared orders move forward to pick, pack, and ship.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4" id="summary-metrics">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-80">Total Pick Order</p>
                        <p className="text-3xl font-semibold mt-1" id="total-pick-order">0</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes opacity-30"><path d="M2.97 10.18a2 2 0 0 0-.2 3.63L9 16.5a2 2 0 0 0 2-.36l5.54-3.84a2 2 0 0 0 .19-3.59L9.13 7.63a2 2 0 0 0-2.08.33l-4.08 2.22Z"/><path d="M2.97 10.18a2 2 0 0 1 .19-3.59L9.13 3.5a2 2 0 0 1 2.08-.33l4.08 2.22a2 2 0 0 1 .19 3.59L9.13 12.5a2 2 0 0 1-2.08.33l-4.08-2.22Z"/><path d="M11.07 13.52a2 2 0 0 1 2.08-.33l4.08 2.22a2 2 0 0 1 .2 3.63l-5.83 2.7a2 2 0 0 1-2-.36l-5.54-3.84a2 2 0 0 1-.19-3.59l5.83-2.7Z"/></svg>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-80">Total Packed Order</p>
                        <p className="text-3xl font-semibold mt-1" id="total-packed-orders">0</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-check opacity-30"><path d="M16 11V5.5L8.5 2H2v13.5L8.5 18H15v-7"/><path d="M16 11h6v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="m20 12 2 2.5"/><path d="m22 12-2 2.5"/></svg>
                </div>
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-80">Total Shipped Order</p>
                        <p className="text-3xl font-semibold mt-1" id="total-shipped-orders">0</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizonal opacity-30"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/></svg>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Payment Accepted</p>
                        <p className="text-3xl font-semibold mt-1 text-gray-800" id="payment-accepted-count">0</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins text-amber-500 opacity-60"><path d="M9.9 14.24a3 3 0 0 0 4.2 0l2.82-2.82a3 3 0 0 0 0-4.2l-.28-.28a3 3 0 0 0-4.2 0l-2.82 2.82a3 3 0 0 0 0 4.2z"/><path d="M15.42 16.58a3 3 0 0 0-4.2 0l-2.82 2.82a3 3 0 0 0 0 4.2l.28.28a3 3 0 0 0 4.2 0l2.82-2.82a3 3 0 0 0 0-4.2z"/><path d="M9 10a5 5 0 0 0 0-10H5a5 5 0 0 0 0 10h4z"/><path d="M19 14a5 5 0 0 0 0-10h-4a5 5 0 0 0 0 10h4z"/></svg>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium">In Progress</p>
                        <p className="text-3xl font-semibold mt-1" id="in-progress-orders">0</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hourglass text-blue-500 opacity-60"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414-4.414A2 2 0 0 0 7 6.172V2"/><path d="M7 22v-4.172a2 2 0 0 1 .586-1.414L12 12l4.414-4.414A2 2 0 0 1 17 6.172V2"/></svg>
                    </div>
            </div>
                
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
                <div className="flex justify-between items-center mb-4 cursor-pointer" id="performance-header">
                    <h2 className="text-xl font-semibold text-gray-800">Performance Manpower</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down performance-header-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="performance-content" className="grid grid-cols-1 md:grid-cols-6 gap-4 hidden">
                    <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Jumlah Picker</p>
                            <input type="number" id="picker-input" defaultValue="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold text-gray-800 transition-colors duration-300" min="0" />
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check text-blue-500 opacity-60"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Jumlah Packer</p>
                            <input type="number" id="packer-input" defaultValue="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold text-gray-800 transition-colors duration-300" min="0" />
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-plus text-emerald-500 opacity-60"><path d="M16 11V5.5L8.5 2H2v13.5L8.5 18H15"/><path d="M16 11h6v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"/><path d="M22 16h-3"/><path d="M19 13v6"/></svg>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Jumlah Dispatcher</p>
                            <input type="number" id="dispatcher-input" defaultValue="0" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-center text-2xl font-semibold text-gray-800 transition-colors duration-300" min="0" />
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck-box text-blue-500 opacity-60"><path d="M21 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"/><path d="M7 17v4a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-4"/><path d="M17 10H7"/><path d="M12 7v6"/></svg>
                    </div>
    
                    <div id="card-performance-picker" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Performance Picker</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="performance-picker-percentage">0%</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-sky-500 opacity-60"><path d="M3 3v18h18"/><path d="m18 8-5 5-4-4-5 5"/></svg>
                    </div>
                    <div id="card-performance-packer" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Performance Packer</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="performance-packer-percentage">0%</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-sky-500 opacity-60"><path d="M3 3v18h18"/><path d="m18 8-5 5-4-4-5 5"/></svg>
                    </div>
                    <div id="card-performance-shipped" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Performance Dispatcher</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="performance-shipped-percentage">0%</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-sky-500 opacity-60"><path d="M3 3v18h18"/><path d="m18 8-5 5-4-4-5 5"/></svg>
                    </div>
    
                    <div id="card-average-pick" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Average Pick / Hours</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="average-pick-per-hour">0</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3 text-fuchsia-500 opacity-60"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                    </div>
                    <div id="card-average-pack" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Average Pack / Hours</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="average-pack-per-hour">0</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock text-red-500 opacity-60"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div id="card-average-shipped" className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 flex items-center justify-between col-span-1">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Average Shipped / Hours</p>
                            <p className="text-2xl font-semibold mt-1 text-gray-800" id="average-shipped-per-hour">0</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck text-orange-500 opacity-60"><path d="M10 17H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h4l2 3h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4v4h-6v-4z"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
                <div className="flex justify-between items-center mb-4 cursor-pointer" id="backlog-header">
                    <h2 className="text-xl font-semibold text-gray-800">Backlog Marketplace</h2>
                    <div className="hidden sm:flex items-center space-x-2 ml-4">
                        <button onClick={() => (window as any).uploadBacklogCSV()} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md hover:bg-blue-600 transition-colors">Upload CSV</button>
                        <button onClick={() => (window as any).exportBacklogCSV()} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-md hover:bg-green-600 transition-colors">Export CSV</button>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down backlog-header-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="backlog-content" className="grid grid-cols-1 md:grid-cols-2 gap-8 hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:table-header-dark uppercase tracking-wider">Store Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:table-header-dark uppercase tracking-wider">Payment Order</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:table-header-dark uppercase tracking-wider">Marketplace Store</th>
                                </tr>
                            </thead>
                            <tbody id="backlog-table-body" className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-8 h-80">
                        <div className="flex items-center justify-between mb-4">
                            <h3 id="backlog-chart-title" className="text-lg font-medium text-gray-800 dark:text-gray-300">Grafik Backlog per Store Name</h3>
                            <div className="flex space-x-2">
                                <button id="filter-platform" className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-md shadow-md hover:bg-indigo-600 transition-colors">Filter by Store Name</button>
                                <button id="filter-source" className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded-md shadow-md hover:bg-gray-400 transition-colors">Filter by Marketplace Store</button>
                            </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                            <button id="chart-data-count" className="px-3 py-1 bg-indigo-500 text-white text-xs rounded-md shadow-md hover:bg-indigo-600 transition-colors">Count of Store</button>
                            <button id="chart-data-payment" className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded-md shadow-md hover:bg-gray-400 transition-colors">Total Payment Orders</button>
                        </div>
                        <canvas id="backlog-chart" className="mt-4"></canvas>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
                <div className="flex justify-between items-center mb-4 cursor-pointer" id="pick-header">
                    <h2 className="text-xl font-semibold text-gray-800">Summary Pick</h2>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="pick-start-hour" className="text-sm font-medium text-gray-700">From:</label>
                        <input type="number" id="pick-start-hour" defaultValue="0" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                        <label htmlFor="pick-end-hour" className="text-sm font-medium text-gray-700">To:</label>
                        <input type="number" id="pick-end-hour" defaultValue="24" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 ml-4">
                        <button onClick={() => (window as any).uploadCSV('pick')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md hover:bg-blue-600 transition-colors">Upload CSV</button>
                        <button onClick={() => (window as any).exportCSV('pick')} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-md hover:bg-green-600 transition-colors">Export CSV</button>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down pick-header-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="pick-content">
                    <div className="overflow-x-auto pb-4">
                        <div id="pick-input-container" className="flex space-x-2 min-w-[1200px]">
                        </div>
                    </div>
                    <div className="mt-8 h-80">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Grafik Total Picked</h3>
                        <canvas id="pick-chart"></canvas>
                    </div>
                </div>
            </div>
    
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
                <div className="flex justify-between items-center mb-4 cursor-pointer" id="pack-header">
                    <h2 className="text-xl font-semibold text-gray-800">Summary Pack</h2>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="pack-start-hour" className="text-sm font-medium text-gray-700">From:</label>
                        <input type="number" id="pack-start-hour" defaultValue="0" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                        <label htmlFor="pack-end-hour" className="text-sm font-medium text-gray-700">To:</label>
                        <input type="number" id="pack-end-hour" defaultValue="24" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 ml-4">
                        <button onClick={() => (window as any).uploadCSV('pack')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md hover:bg-blue-600 transition-colors">Upload CSV</button>
                        <button onClick={() => (window as any).exportCSV('pack')} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-md hover:bg-green-600 transition-colors">Export CSV</button>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down pack-header-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="pack-content">
                    <div className="overflow-x-auto pb-4">
                        <div id="pack-input-container" className="flex space-x-2 min-w-[1200px]">
                        </div>
                    </div>
                    <div className="mt-8 h-80">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Grafik Total Packed</h3>
                        <canvas id="pack-chart"></canvas>
                    </div>
                </div>
            </div>
    
            <div className="bg-white p-6 rounded-2xl shadow-lg transition-colors duration-300 mb-4">
                <div className="flex justify-between items-center mb-4 cursor-pointer" id="shipped-header">
                    <h2 className="text-xl font-semibold text-gray-800">Summary Ship</h2>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="shipped-start-hour" className="text-sm font-medium text-gray-700">From:</label>
                        <input type="number" id="shipped-start-hour" defaultValue="0" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                        <label htmlFor="shipped-end-hour" className="text-sm font-medium text-gray-700">To:</label>
                        <input type="number" id="shipped-end-hour" defaultValue="24" min="0" max="24" className="w-16 p-1 border rounded-md text-center"/>
                    </div>
                    <div className="hidden sm:flex items-center space-x-2 ml-4">
                        <button onClick={() => (window as any).uploadCSV('shipped')} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md shadow-md hover:bg-blue-600 transition-colors">Upload CSV</button>
                        <button onClick={() => (window as any).exportCSV('shipped')} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md shadow-md hover:bg-green-600 transition-colors">Export CSV</button>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down shipped-header-icon"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                <div id="shipped-content">
                    <div className="overflow-x-auto pb-4">
                        <div id="shipped-input-container" className="flex space-x-2 min-w-[1200px]">
                        </div>
                    </div>
                    <div className="mt-8 h-80">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Grafik Total Shipped</h3>
                        <canvas id="shipped-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div id="toast-container"></div>
    </>
  );
}

    