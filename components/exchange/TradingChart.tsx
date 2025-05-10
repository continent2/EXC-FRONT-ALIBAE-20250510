import * as React from "react";
import styles from "./index.module.css";
import { widget } from "../../public/static/charting_library";
import Datafeed from "components/exchange/api";
import {
  DISABLED_FEATURES,
  ENABLED_FEATURES,
  TIME_FRAMES,
} from "./api/chartConfig";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

type MyProps = {
  coinpair: any;
  currentPair: string;
  interval: string;
  theme: string;
  ThemeColor: {
    green: string;
    red: string;
  };
};

export class TVChartContainer extends React.Component<MyProps> {
  static defaultProps = {
    symbol: `:`,
    interval: "15",
    containerId: "tv_chart_container",
    libraryPath: "/static/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {
      "volume.volume.color.0": "#dc3545",
      "volume.volume.color.1": "#32d777",
      "volume.volume.transparency": 0,
      "volume.volume ma.color": "#3742fa",
      "volume.volume ma.transparency": 0,
      "volume.options.showStudyArguments": false,
      "volume.options.showStudyTitles": false,
      "volume.options.showStudyValues": false,
      "volume.options.showLegend": false,
      "volume.options.showStudyOutput": false,
      "volume.options.showStudyOverlay": false,
      "volume.options.showSeriesTitle": false,
      "volume.options.showSeriesOHLC": false,
      "volume.options.showBarChange": false,
      "volume.options.showCountdown": false,
      "volume.volume ma.linewidth": 2,
      "volume.volume ma.visible": true,
    },
    overrides: {
      "mainSeriesProperties.candleStyle.upColor": "#ffffff",
      "mainSeriesProperties.candleStyle.downColor": "#000000",
      "mainSeriesProperties.candleStyle.drawBorder": true,
      "mainSeriesProperties.candleStyle.borderUpColor": "#00ff00",
      "mainSeriesProperties.candleStyle.borderDownColor": "#ff0000",
      "mainSeriesProperties.style": 1,
    },
  };

  private dataRefreshInterval: NodeJS.Timeout | null = null;
  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: MyProps) {
    super(props);
    this.ref = React.createRef();
  }

  chartInit = (config: any) => {
    const widgetInstance = new widget(config);
    (window as any).tvWidget = widgetInstance;

    (window as any).tvWidget.onChartReady(() => {
      (window as any).tvWidget
        .activeChart()
        .createStudy(
          "Moving Average",
          false,
          false,
          { length: 5 },
          { "plot.color.0": "#9b59b6" }
        );
      (window as any).tvWidget
        .activeChart()
        .createStudy(
          "Moving Average",
          false,
          false,
          { length: 10 },
          { "plot.color.0": "#d35400" }
        );
      (window as any).tvWidget
        .activeChart()
        .createStudy(
          "Moving Average",
          false,
          false,
          { length: 30 },
          { "plot.color.0": "#00cec9" }
        );

      const localTheme = localStorage.getItem("theme");
      (window as any).tvWidget.applyOverrides({
        "paneProperties.background":
          this.props.theme === "dark" ? "rgb(11, 14, 17)" : "#fff",
        "paneProperties.backgroundType": "solid",
        "mainSeriesProperties.candleStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.candleStyle.wickUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.wickDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.upColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.downColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.drawWick": true,
        "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
        "mainSeriesProperties.hollowCandleStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.wickUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.wickDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.drawWick": true,
        "mainSeriesProperties.haStyle.drawBorder": true,
        "mainSeriesProperties.haStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.wickUpColor": this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.wickDownColor": this.props.ThemeColor.red,
        "mainSeriesProperties.barStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.barStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
        "mainSeriesProperties.barStyle.dontDrawOpen": false,
        "mainSeriesProperties.lineStyle.color": this.props.ThemeColor.red,
      });
    });
  };
  componentDidMount() {
    const widgetOptions = {
      height: 480,
      width: 1400,
      symbol: `:${this.props.currentPair}`,
      style: 1,
      theme: this.props.theme === "dark" ? "dark" : "light",
      datafeed: Datafeed,
      interval: this.props.interval,
      container: this.ref.current,
      library_path: "/static/charting_library/",
      locale: getLanguageFromURL() || "en",
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      studies_overrides: {
        "volume.volume.color.0": this.props.ThemeColor.red,
        "volume.volume.color.1": this.props.ThemeColor.green,
        "volume.volume.transparency": 0,
        "volume.volume ma.color": "#9b59b6",
        "volume.volume ma.transparency": 0,
        "volume.volume ma.linewidth": 1,
        "volume.volume ma.visible": true,
      },
      enabled_features: ENABLED_FEATURES,
      disabled_features: DISABLED_FEATURES,
      custom_css_url: "css/style.css",
      time_frames: TIME_FRAMES,
      toolbar: false,
    };

    this.chartInit(widgetOptions);
    this.setupDataRefresh();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.theme !== prevProps.theme) {
      const overwriteObj = {
        "paneProperties.background":
          this.props.theme === "dark" ? "rgb(11, 14, 17)" : "#fff",
        "paneProperties.backgroundType": "solid",
        "mainSeriesProperties.candleStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.candleStyle.wickUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.candleStyle.wickDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.upColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.downColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.drawWick": true,
        "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
        "mainSeriesProperties.hollowCandleStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.hollowCandleStyle.wickUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.hollowCandleStyle.wickDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.drawWick": true,
        "mainSeriesProperties.haStyle.drawBorder": true,
        "mainSeriesProperties.haStyle.borderUpColor":
          this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.borderDownColor":
          this.props.ThemeColor.red,
        "mainSeriesProperties.haStyle.wickUpColor": this.props.ThemeColor.green,
        "mainSeriesProperties.haStyle.wickDownColor": this.props.ThemeColor.red,
        "mainSeriesProperties.barStyle.upColor": this.props.ThemeColor.green,
        "mainSeriesProperties.barStyle.downColor": this.props.ThemeColor.red,
        "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
        "mainSeriesProperties.barStyle.dontDrawOpen": false,
        "mainSeriesProperties.lineStyle.color": this.props.ThemeColor.red,
      };

      (window as any).tvWidget?.onChartReady(() => {
        (window as any).tvWidget?.applyOverrides(overwriteObj);
        (window as any).tvWidget
          ?.changeTheme(this.props.theme === "dark" ? "Dark" : "Light")
          .then(() => {
            (window as any).tvWidget?.applyOverrides(overwriteObj);
          });
      });
    }

    if (
      this.props.ThemeColor.green !== prevProps.ThemeColor.green ||
      this.props.ThemeColor.red !== prevProps.ThemeColor.red
    ) {
      const overwriteObj = {
        // ... same as above overwriteObj
      };

      (window as any).tvWidget?.onChartReady(() => {
        (window as any).tvWidget?.applyOverrides(overwriteObj);
        (window as any).tvWidget
          ?.changeTheme(this.props.theme === "dark" ? "Dark" : "Light")
          .then(() => {
            (window as any).tvWidget?.applyOverrides(overwriteObj);
          });
      });
    }

    if (this.props.currentPair !== prevProps.currentPair) {
      const newSymbol = `:${this.props.currentPair.replace("_", "/")}`;
      (window as any).tvWidget?.setSymbol(
        newSymbol ? newSymbol : "",
        this.props.interval,
        () => {}
      );
      this.setupDataRefresh(); // Reset refresh timer on pair change
    }
  }
  componentWillUnmount() {
    this.clearDataRefresh();
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );

    if ((window as any).tvWidget !== null) {
      (window as any).tvWidget.remove();
      (window as any).tvWidget = null;
    }
  }
  setupDataRefresh = () => {
    this.clearDataRefresh();

    this.dataRefreshInterval = setInterval(() => {
      if ((window as any).tvWidget) {
        (window as any).tvWidget.activeChart().resetData();
      }
    }, 30000); // 30 seconds
  };

  clearDataRefresh = () => {
    if (this.dataRefreshInterval) {
      clearInterval(this.dataRefreshInterval);
      this.dataRefreshInterval = null;
    }
  };

  handleVisibilityChange = () => {
    if (document.hidden) {
      this.clearDataRefresh();
    } else {
      this.setupDataRefresh();
    }
  };

  render() {
    return (
      <>
        <header className={styles.VersionHeader}></header>
        <div ref={this.ref} className={styles.TVChartContainer} />
      </>
    );
  }
}
