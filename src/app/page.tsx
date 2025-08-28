"use client"
import { useEffect } from 'react';
import { ChevronRight, ShoppingCart, Sun, Moon, Boxes, PackageCheck, SendHorizonal, Coins, Hourglass, Users, BarChart3, Clock, Truck, Pencil, Upload, Download, Settings2, ChevronsLeft, ChevronsRight } from 'lucide-react';

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
    let summary: any = {};
    let pickChartInstance: any;
    let packChartInstance: any;
    let shippedChartInstance: any;
    let backlogChartInstance: any; 
    let currentPage = 1;
    let recordsPerPage = 5;

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
      { platform: "Shopee Jung Saem Mool", payment_order: "500", source: "Jung Saem Mool Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Amuse", payment_order: "240", source: "Amuse Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Carasun", payment_order: "300", source: "Carasun.id Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Ariul", payment_order: "120", source: "Ariul Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Dr G", payment_order: "450", source: "Dr G Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Im From", payment_order: "200", source: "Im From Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee COSRX", payment_order: "800", source: "COSRX Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Espoir", payment_order: "150", source: "Espoir Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Mediheal", payment_order: "250", source: "Mediheal Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Keana", payment_order: "100", source: "Keana Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Lilla Baby", payment_order: "50", source: "Lilla Baby Indonesia", marketplace_platform: "Shopee" },
      { platform: "Shopee lilla", payment_order: "80", source: "Lilla Official store", marketplace_platform: "Shopee" },
      { platform: "Shopee", payment_order: "1200", source: "Edit by Sociolla", marketplace_platform: "Shopee" },
      { platform: "Shopee Round Lab", payment_order: "320", source: "Round Lab Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Speak to me", payment_order: "40", source: "Speak To Me Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Sukin", payment_order: "90", source: "Sukin Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Woshday", payment_order: "20", source: "Woshday Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Gemistry", payment_order: "60", source: "Gemistry Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Sungboon Editor", payment_order: "180", source: "Sungboon Editor Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee Derma Angel", payment_order: "110", source: "Derma Angel Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee UIQ", payment_order: "70", source: "UIQ Official Store", marketplace_platform: "Shopee" },
      { platform: "Shopee UB Mom", payment_order: "30", source: "UB Mom Indonesia", marketplace_platform: "Shopee" },
      { platform: "Shopee Bioheal", payment_order: "139", source: "Bioheal Official Store", marketplace_platform: "Shopee" },
      { platform: "Lazada Cosrx", payment_order: "234", source: "COSRX Official Store", marketplace_platform: "Lazada" },
      { platform: "tiktok_lilla", payment_order: "400", source: "Lilla Official store", marketplace_platform: "Tiktok" },
      { platform: "tiktok_cosrx", payment_order: "550", source: "COSRX Official Store", marketplace_platform: "Tiktok" },
      { platform: "tiktok_carasun", payment_order: "210", source: "Carasun.id Official Store", marketplace_platform: "Tiktok" },
      { platform: "tiktok_derma_angel", payment_order: "80", source: "Derma Angel Official Store", marketplace_platform: "Tiktok" },
      { platform: "tiktok_lilla_Baby", payment_order: "40", source: "Lilla Baby Indonesia", marketplace_platform: "Tiktok" },
      { platform: "tiktok", payment_order: "300", source: "Edit by Sociolla", marketplace_platform: "Tiktok" },
      { platform: "tiktok_roundlab", payment_order: "158", source: "Round Lab Official Store", marketplace_platform: "Tiktok" },
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
                    } else if (type === 'pack') {
                        originalPackData = [...newData];
                        packData = [...originalPackData];
                    } else if (type === 'shipped') {
                        originalShippedData = [...newData];
                        shippedData = [...originalShippedData];
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
        const headers = ['Marketplace Store', 'Store Name', 'Platform', 'Payment Order'];
        let csvContent = headers.join(',') + '\n';
        backlogData.forEach(item => {
            csvContent += `${item.source},${item.platform},${item.marketplace_platform},${item.payment_order}\n`;
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
                        if (parts.length >= 4) { 
                            newBacklogData.push({
                                source: parts[0].trim(),
                                platform: parts[1].trim(),
                                marketplace_platform: parts[2].trim(),
                                payment_order: (parts[3].trim() && !isNaN(parseInt(parts[3].trim(), 10))) ? parts[3].trim() : "0", 
                            });
                        }
                    });
                    backlogData = [...newBacklogData];
                    currentPage = 1;
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
    
    const updateSummary = () => {
        const totalPickOrder = pickData.reduce((sum, value) => sum + (value || 0), 0);
        const totalPackOrder = packData.reduce((sum, value) => sum + (value || 0), 0);
        const totalShippedOrder = shippedData.reduce((sum, value) => sum + (value || 0), 0);
        const paymentOrders = backlogData.reduce((sum, item) => sum + (parseInt(item.payment_order, 10) || 0), 0);
        
        const inProgressOrders = totalPickOrder - totalPackOrder;

        const marketplaceStoreCount = new Set(backlogData.map(item => item.platform)).size;
        
        summary = {
            totalPickOrder,
            totalPacked: totalPackOrder,
            totalShipped: totalShippedOrder,
            payment: paymentOrders,
            inProgress: inProgressOrders,
            marketplaceStoreCount,
        };
        
        const formatNumber = (num: number) => num.toLocaleString('en-US');

        const setInnerText = (id: string, text: string) => {
          const el = document.getElementById(id);
          if (el) el.innerText = text;
        }

        setInnerText('total-pick-order', formatNumber(summary.totalPickOrder));
        setInnerText('total-packed-orders', formatNumber(summary.totalPacked));
        setInnerText('total-shipped-orders', formatNumber(summary.totalShipped));
        setInnerText('payment-accepted-count', formatNumber(summary.payment));
        setInnerText('in-progress-orders', formatNumber(summary.inProgress));

        setInnerText('summary-pick-total', formatNumber(summary.totalPickOrder));
        setInnerText('summary-pack-total', formatNumber(summary.totalPacked));
        setInnerText('summary-ship-total', formatNumber(summary.totalShipped));
        setInnerText('backlog-total', formatNumber(summary.payment));
        setInnerText('chart-payment-accepted-value', formatNumber(summary.payment));
        setInnerText('chart-marketplace-store-value', summary.marketplaceStoreCount.toString());
    };

    const renderCharts = async () => {
        const Chart = (await import('chart.js/auto')).default;
        const ChartDataLabels = (await import('chartjs-plugin-datalabels')).default;
        Chart.register(ChartDataLabels);

        if (backlogChartInstance) {
          backlogChartInstance.destroy();
        }

        const backlogCtx = document.getElementById('backlog-chart') as HTMLCanvasElement;
        if (backlogCtx) {
          const filterSelect = document.getElementById('backlog-filter') as HTMLSelectElement;
          const filterValue = filterSelect ? filterSelect.value : 'platform';
          
          const groupedData: { [key: string]: number } = {};

          backlogData.forEach(item => {
            let key;
            if (filterValue === 'marketplace_platform') {
              key = item.marketplace_platform;
            } else {
              key = item[filterValue];
            }
             if (filterValue === 'marketplace_platform') {
                if (key.toLowerCase().includes('shopee')) key = 'Shopee';
                if (key.toLowerCase().includes('tiktok')) key = 'Tiktok';
                if (key.toLowerCase().includes('lazada')) key = 'Lazada';
            }
            
            const payment = parseInt(item.payment_order, 10) || 0;
            if (groupedData[key]) {
              groupedData[key] += payment
            } else {
              groupedData[key] = payment;
            }
          });

          const labels = Object.keys(groupedData);
          const data = Object.values(groupedData);

          const chartColors = [
              'rgba(59, 130, 246, 0.8)', 
              'rgba(34, 197, 94, 0.8)', 
              'rgba(239, 68, 68, 0.8)', 
              'rgba(249, 115, 22, 0.8)', 
              'rgba(168, 85, 247, 0.8)', 
              'rgba(234, 179, 8, 0.8)'
          ];

          backlogChartInstance = new Chart(backlogCtx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Payment Accepted',
                data: data,
                backgroundColor: chartColors,
                borderColor: chartColors.map(color => color.replace('0.8', '1')),
                borderWidth: 1,
                borderRadius: 5,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US').format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                },
                datalabels: {
                    color: '#fff',
                    anchor: 'center',
                    align: 'center',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value) => {
                        return value > 999 ? new Intl.NumberFormat('en-US').format(value) : '';
                    }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#E5E7EB'
                  },
                  ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(Number(value));
                    }
                  }
                },
                 x: {
                    grid: {
                        display: false
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
    
    const renderBacklogTable = () => {
        const tableBody = document.getElementById('backlog-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const paginatedData = backlogData.slice(startIndex, endIndex);

        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.source}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${item.platform}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${item.marketplace_platform}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${(parseInt(item.payment_order, 10) || 0).toLocaleString('en-US')}</td>
            `;
            tableBody.appendChild(row);
        });
        updatePaginationControls();
    };
    
    const updatePaginationControls = () => {
      const pageInfo = document.getElementById('page-info');
      const totalRecords = backlogData.length;
      const totalPages = Math.ceil(totalRecords / recordsPerPage);

      const startRecord = (currentPage - 1) * recordsPerPage + 1;
      const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

      if (pageInfo) {
          pageInfo.innerText = `${startRecord}-${endRecord} of ${totalRecords}`;
      }

      (document.getElementById('first-page') as HTMLButtonElement).disabled = currentPage === 1;
      (document.getElementById('prev-page') as HTMLButtonElement).disabled = currentPage === 1;
      (document.getElementById('next-page') as HTMLButtonElement).disabled = currentPage === totalPages;
      (document.getElementById('last-page') as HTMLButtonElement).disabled = currentPage === totalPages;
    }

    const changePage = (page: number) => {
        const totalRecords = backlogData.length;
        const totalPages = Math.ceil(totalRecords / recordsPerPage);
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        currentPage = page;
        renderBacklogTable();
    }
    
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
    
    updateDashboard();
        
    const setupCollapsible = (headerId: string, contentId: string) => {
      const header = document.getElementById(headerId);
      const icon = header?.querySelector('.chevron-icon');
      const content = document.getElementById(contentId);
      header?.addEventListener('click', (e) => {
          // prevent header click from toggling when clicking on buttons inside
          if ((e.target as HTMLElement).closest('button')) {
            return;
          }
          const isHidden = content?.classList.toggle('hidden');
          if (isHidden) {
              icon?.classList.remove('rotate-90');
          } else {
              icon?.classList.add('rotate-90');
          }
      });
    }

    setupCollapsible('marketplace-performance-header', 'marketplace-performance-content');
    setupCollapsible('backlog-header', 'backlog-content');
    setupCollapsible('summary-pick-header', 'summary-pick-content');
    setupCollapsible('summary-pack-header', 'summary-pack-content');
    setupCollapsible('summary-ship-header', 'summary-ship-content');

    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        document.body.classList.toggle('dark');
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        renderCharts();
    });

    const backlogFilter = document.getElementById('backlog-filter');
    if (backlogFilter) {
      backlogFilter.addEventListener('change', renderCharts);
    }
    
    document.getElementById('records-per-page')?.addEventListener('change', (e) => {
      recordsPerPage = parseInt((e.target as HTMLSelectElement).value, 10);
      currentPage = 1;
      renderBacklogTable();
    });

    document.getElementById('first-page')?.addEventListener('click', () => changePage(1));
    document.getElementById('prev-page')?.addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('next-page')?.addEventListener('click', () => changePage(currentPage + 1));
    document.getElementById('last-page')?.addEventListener('click', () => {
      const totalRecords = backlogData.length;
      const totalPages = Math.ceil(totalRecords / recordsPerPage);
      changePage(totalPages);
    });

  }, []);

  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
        <div id="app" className="w-full max-w-7xl mx-auto space-y-6">
            
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-indigo-500" />
                    <h1 className="text-2xl font-bold">
                        Fulfillment Marketplace
                    </h1>
                </div>
                <button id="theme-toggle" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                    <Sun className="h-6 w-6 hidden dark:block" />
                    <Moon className="h-6 w-6 block dark:hidden" />
                </button>
            </header>

            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    From <span className="text-gray-700 dark:text-gray-300 font-medium">payment</span> to progress — only cleared orders move forward to <span className="text-gray-700 dark:text-gray-300 font-medium">pick, pack, and ship.</span>
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                    <p className="text-sm font-medium">Total Pick Order</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold" id="total-pick-order">0</p>
                        <Boxes className="w-8 h-8 opacity-70" />
                    </div>
                </div>
                <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                    <p className="text-sm font-medium">Total Packed Order</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold" id="total-packed-orders">0</p>
                         <PackageCheck className="w-8 h-8 opacity-70" />
                    </div>
                </div>
                <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                    <p className="text-sm font-medium">Total Shipped Order</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold" id="total-shipped-orders">0</p>
                        <SendHorizonal className="w-8 h-8 opacity-70" />
                    </div>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                    <p className="text-sm font-medium">Payment Accepted</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold" id="payment-accepted-count">0</p>
                        <Coins className="w-8 h-8 opacity-70" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-semibold" id="in-progress-orders">0</p>
                        <Hourglass className="w-8 h-8 text-blue-500 opacity-80" />
                    </div>
                </div>
            </div>
            
            <div className="space-y-3">
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div id="marketplace-performance-header" className="flex justify-between items-center p-4 cursor-pointer">
                        <h2 className="text-lg font-semibold">Marketplace Performance</h2>
                        <ChevronRight className="chevron-icon w-5 h-5 transition-transform" />
                    </div>
                    <div id="marketplace-performance-content" className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
                        <p>Performance content goes here...</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div id="backlog-header" className="flex justify-between items-center p-4 cursor-pointer">
                        <h2 className="text-lg font-semibold">Backlog Marketplace</h2>
                        <ChevronRight className="chevron-icon w-5 h-5 transition-transform" />
                    </div>
                    <div id="backlog-content" className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-2 mb-4">
                            <button className="flex items-center gap-1 text-sm px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                               <Pencil size={14} /> Edit
                           </button>
                            <button onClick={() => (window as any).uploadBacklogCSV()} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
                                <Upload size={14} /> Upload
                            </button>
                            <button onClick={() => (window as any).exportBacklogCSV()} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700">
                                <Download size={14} /> Export
                            </button>
                        </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marketplace Store</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Store Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Platform</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Accepted</th>
                                </tr>
                            </thead>
                            <tbody id="backlog-table-body" className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-end space-x-2 py-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Records per page:</span>
                        <select id="records-per-page" className="border rounded-md px-2 py-1 dark:bg-gray-700 dark:border-gray-600">
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="30">30</option>
                        </select>
                        <span id="page-info" className="text-gray-500 dark:text-gray-400 w-24 text-center">1-5 of 31</span>
                        <div className="flex items-center space-x-1">
                            <button id="first-page" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronsLeft className="w-5 h-5" />
                            </button>
                            <button id="prev-page" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5 transform rotate-180" />
                            </button>
                            <button id="next-page" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <button id="last-page" className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronsRight className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Grafik Backlog Marketplace Store</h3>
                             <div className="flex items-center gap-2">
                                <select id="backlog-filter" className="border rounded-md px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600">
                                  <option value="source">Marketplace Store</option>
                                  <option value="platform">Store Name</option>
                                  <option value="marketplace_platform">Platform</option>
                                </select>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Accepted</p>
                                <p id="chart-payment-accepted-value" className="text-2xl font-bold text-indigo-500">0</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Marketplace Store</p>
                                <p id="chart-marketplace-store-value" className="text-2xl font-bold text-indigo-500">0</p>
                            </div>
                        </div>
                        <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-md p-4" style={{background: 'linear-gradient(180deg, #1E293B 0%, #334155 100%)'}}>
                           <canvas id="backlog-chart"></canvas>
                        </div>
                      </div>
                    </div>
                </div>

                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div id="summary-pick-header" className="flex justify-between items-center p-4 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <h2 className="text-lg font-semibold">Summary Pick</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span id="summary-pick-total">0</span></p>
                        </div>
                        <ChevronRight className="chevron-icon w-5 h-5 transition-transform" />
                    </div>
                    <div id="summary-pick-content" className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
                        <p>Pick summary content goes here...</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div id="summary-pack-header" className="flex justify-between items-center p-4 cursor-pointer">
                        <div className="flex items-center gap-4">
                           <h2 className="text-lg font-semibold">Summary Pack</h2>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span id="summary-pack-total">0</span></p>
                        </div>
                        <ChevronRight className="chevron-icon w-5 h-5 transition-transform" />
                    </div>
                    <div id="summary-pack-content" className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
                       <p>Pack summary content goes here...</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div id="summary-ship-header" className="flex justify-between items-center p-4 cursor-pointer">
                       <div className="flex items-center gap-4">
                           <h2 className="text-lg font-semibold">Summary Ship</h2>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Total: <span id="summary-ship-total">0</span></p>
                        </div>
                        <ChevronRight className="chevron-icon w-5 h-5 transition-transform" />
                    </div>
                    <div id="summary-ship-content" className="hidden p-4 border-t border-gray-200 dark:border-gray-700">
                       <p>Ship summary content goes here...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div id="toast-container"></div>
    </>
  );
}
