import { getChartData, getChartDataWithoutTime } from "service/trading-chart";

const history: any = {};
let previousBase: string | null = null;
let previousTrade: string | null = null;
let previousURL: string | null = null;
let lastFetchTimestamp: number = 0;

export default {
  history: history,
  hitted: false,

  getBars: function (
    symbolInfo: any,
    resolution: any,
    from: number,
    to: number,
    first: boolean,
    limit: number,
    timestamp?: number
  ) {
    const base = localStorage.getItem("base_coin_id");
    const trade = localStorage.getItem("trade_coin_id");
    const currentURL = window.location.href;

    // Check if we need to reset the cache (coin pair changed or URL changed)
    if (
      base !== previousBase ||
      trade !== previousTrade ||
      currentURL !== previousURL
    ) {
      this.hitted = false;
      previousBase = base;
      previousTrade = trade;
      previousURL = currentURL;
      lastFetchTimestamp = 0; // Reset timestamp when pair changes
    }

    // Force refresh if data is older than 30 seconds
    const now = Date.now();
    const shouldForceRefresh = timestamp && now - lastFetchTimestamp > 30000;

    if (!this.hitted || shouldForceRefresh) {
      if (shouldForceRefresh) {
        this.hitted = false; // Force full refresh
      }

      this.hitted = true;
      lastFetchTimestamp = now;

      return getChartData(15, from, to, base, trade).then((data: any) => {
        if (data.data.data.length) {
          const myBars = data.data.data;
          // Consider removing the duplication if not needed
          let klines4800 = [...myBars, ...myBars];
          const bars = klines4800.map((el: any) => ({
            time: el.time * 1000,
            low: parseFloat(el.low),
            high: parseFloat(el.high),
            open: parseFloat(el.open),
            close: parseFloat(el.close),
            volume: parseFloat(el.volume),
          }));
          if (first) {
            const lastBar = bars[bars.length - 1];
            history[symbolInfo.name] = { lastBar };
          }
          return bars;
        }
        return [];
      });
    } else {
      return getChartDataWithoutTime(5, from, to, base, trade).then(
        (data: any) => {
          if (data.data.data.length) {
            const myBars = data.data.data;
            // Consider removing the duplication if not needed
            let klines4800 = [...myBars, ...myBars];
            const bars = klines4800.map((el: any) => ({
              time: el.time * 1000,
              low: parseFloat(el.low),
              high: parseFloat(el.high),
              open: parseFloat(el.open),
              close: parseFloat(el.close),
              volume: parseFloat(el.volume),
            }));
            if (first) {
              const lastBar = bars[bars.length - 1];
              history[symbolInfo.name] = { lastBar };
            }
            return bars;
          }
          this.hitted = false;
          return [];
        }
      );
    }
  },
};